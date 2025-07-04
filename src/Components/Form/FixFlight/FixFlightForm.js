import React, { useState, useEffect, useRef } from "react";
import {
    ChevronDown,
    Calendar,
    Clock,
    Plane,
    Users,
    Plus,
    Trash2,
    X,
    Lock,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./FixFlightForm.module.css";
import axios from "axios";

export default function FixFlightForm({
    onClose,
    routeData,
    onSendData,
    data,
}) {
    const [formData, setFormData] = useState({
        flightCode: data.flight_id,
        airline: data.flight_route_id,
        departure: data.departure_airport,
        destination: data.arrival_airport,
        date: data.departure_date,
        time: data.departure_time?.slice(0, 5) || null,
        totalSeats: data.total_seats,
        duration:
            (new Date(
                `${data.departure_date.split("T")[0]}T${data.arrival_time}`,
            ).getTime() +
                (new Date(
                    `${data.departure_date.split("T")[0]}T${data.arrival_time}`,
                ) <
                new Date(
                    `${data.departure_date.split("T")[0]}T${data.departure_time}`,
                )
                    ? 86400000
                    : 0) -
                new Date(
                    `${data.departure_date.split("T")[0]}T${data.departure_time}`,
                ).getTime()) /
            60000,
        seatClasses: data.seat_information.seat_type.map((type, index) => ({
            class: type,
            quantity:
                data.seat_information.empty_type_seats[index] +
                data.seat_information.occupied_type_seats[index],
        })),
    });

    const [seatClassData, setSeatClassData] = useState([]);

    useEffect(() => {
        const fetchTicketClasses = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/flight_management/ticket_route",
                    {
                        params: {
                            flight_route_id: formData.airline,
                            skip: 0,
                            limit: 1000,
                        },
                    },
                );
                const seatData = response.data.map((ticketClass) => {
                    return ticketClass.ticket_class_name;
                });
                setSeatClassData(seatData);
            } catch (error) {
                console.error(
                    "Lỗi khi lấy hạng vé:",
                    error.response?.data || error.message,
                );
            }
        };
        if (formData.airline) {
            fetchTicketClasses();
        }
    }, [formData.airline]);

    const [dropdowns, setDropdowns] = useState({
        airline: false,
        departure: false,
        destination: false,
        seatClass: false,
        date: false,
    });

    const dropdownRefs = useRef({});

    const [newSeatClass, setNewSeatClass] = useState({
        class: "",
        quantity: "",
    });

    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }));
    };

    const clearSelection = (field, event) => {
        event.stopPropagation();

        // If clearing airline, also clear departure and destination
        if (field === "airline") {
            setFormData((prev) => ({
                ...prev,
                airline: "",
                departure: "",
                destination: "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdowns).forEach((key) => {
                if (
                    dropdownRefs.current[key] &&
                    !dropdownRefs.current[key].contains(event.target) &&
                    dropdowns[key]
                ) {
                    setDropdowns((prev) => ({
                        ...prev,
                        [key]: false,
                    }));
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdowns]);

    const selectOption = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setDropdowns((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = () => {
        const dataRequired = {
            flight_id: formData.flightCode || null,
            flight_route: formData.airline || null,
            departure_airport: formData.departure || null,
            arrival_airport: formData.destination || null,
            departure_date: formData.date || null,
            departure_time: formData.time || null,
            flight_duration: parseInt(formData.duration, 10) || null,
            total_seats: parseInt(formData.totalSeats, 10) || null,
            seat_type: formData.seatClasses.map((item) => item.class),
            total_type_seats: formData.seatClasses.map((item) =>
                parseInt(item.quantity, 10),
            ),
        };
        onSendData(dataRequired);
        onClose();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Biểu mẫu sửa một chuyến bay</h2>
            </div>

            <div className={styles.form}>
                {/* Row 1 */}
                <div className={styles.row}>
                    {/* Flight Code */}
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={formData.flightCode}
                            onChange={(e) => {
                                // Keep the flight code locked
                                // handleInputChange("flightCode", e.target.value)
                            }}
                            className={`${styles.input} ${styles.disabledDropdown} ${styles.airlineButton}`}
                            placeholder="Mã chuyến bay"
                            title="Mã chuyến bay không thể thay đổi"
                            readOnly
                        />
                        <Lock className={styles.inputIcon} size={20} />
                    </div>

                    {/* Airline Dropdown */}
                    <div
                        className={styles.dropdown}
                        ref={(el) => (dropdownRefs.current.airline = el)}
                        style={{
                            zIndex: dropdowns.airline ? 2500 : 1000,
                        }}
                    >
                        <button
                            className={`${styles.dropdownButton} ${formData.airline ? styles.airlineButton : ""}`}
                            onClick={() => toggleDropdown("airline")}
                            title="Chọn mã tuyến bay"
                        >
                            {formData.airline || "Mã tuyến bay"}
                            {formData.airline ? (
                                <X
                                    size={20}
                                    onClick={(e) =>
                                        clearSelection("airline", e)
                                    }
                                    className={styles.clearIcon}
                                />
                            ) : (
                                <ChevronDown size={20} />
                            )}
                        </button>
                        {dropdowns.airline && (
                            <div className={styles.dropdownMenu}>
                                {routeData.map((route, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    departure:
                                                        route.departure_airport
                                                            ?.airport_name ||
                                                        "Unknown Departure",
                                                    destination:
                                                        route.arrival_airport
                                                            ?.airport_name ||
                                                        "Unknown Arrival",
                                                    seatClasses: [],
                                                });
                                                selectOption(
                                                    "airline",
                                                    route.flight_route,
                                                );
                                            }}
                                        >
                                            {route.flight_route}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 2 */}
                <div className={styles.row}>
                    {/* Departure */}
                    <div
                        className={styles.dropdown}
                        ref={(el) => (dropdownRefs.current.departure = el)}
                        style={{
                            zIndex: dropdowns.departure ? 2500 : 1000,
                        }}
                    >
                        <button
                            className={`${styles.dropdownButton} ${formData.departure ? styles.airlineButton : ""} ${formData.airline ? styles.disabledDropdown : ""}`}
                            title={
                                formData.airline
                                    ? "Đã được khóa khi chọn mã tuyến bay"
                                    : "Chọn sân bay đi"
                            }
                            onClick={() =>
                                formData.airline
                                    ? null
                                    : toggleDropdown("departure")
                            }
                        >
                            {formData.departure || "Sân bay đi"}
                            {formData.departure ? (
                                formData.airline ? (
                                    <Lock
                                        className={styles.inputIcon}
                                        size={20}
                                    />
                                ) : (
                                    <X
                                        size={20}
                                        onClick={(e) => {
                                            clearSelection("departure", e);
                                        }}
                                        className={styles.clearIcon}
                                    />
                                )
                            ) : (
                                <Plane className={styles.inputIcon} size={20} />
                            )}
                        </button>
                        {dropdowns.departure && (
                            <div className={styles.dropdownMenu}>
                                {routeData.map((route, index) => (
                                    <div
                                        key={index}
                                        className={styles.dropdownItem}
                                        onClick={() =>
                                            selectOption(
                                                "departure",
                                                route.departure_airport
                                                    ?.airport_name,
                                            )
                                        }
                                    >
                                        {route.departure_airport?.airport_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Destination */}
                    <div
                        className={styles.dropdown}
                        ref={(el) => (dropdownRefs.current.destination = el)}
                        style={{
                            zIndex: dropdowns.destination ? 2500 : 1000,
                        }}
                    >
                        <button
                            className={`${styles.dropdownButton} ${formData.destination ? styles.airlineButton : ""} ${formData.airline ? styles.disabledDropdown : ""}`}
                            title={
                                formData.airline
                                    ? "Đã được khóa khi chọn mã tuyến bay"
                                    : "Chọn sân bay đến"
                            }
                            onClick={() =>
                                formData.airline
                                    ? null
                                    : toggleDropdown("destination")
                            }
                        >
                            {formData.destination || "Sân bay đến"}
                            {formData.destination ? (
                                formData.airline ? (
                                    <Lock
                                        className={styles.inputIcon}
                                        size={20}
                                    />
                                ) : (
                                    <X
                                        size={20}
                                        onClick={(e) => {
                                            clearSelection("destination", e);
                                        }}
                                        className={styles.clearIcon}
                                    />
                                )
                            ) : (
                                <Plane className={styles.inputIcon} size={20} />
                            )}
                        </button>
                        {dropdowns.destination && (
                            <div className={styles.dropdownMenu}>
                                {routeData.map((route, index) => (
                                    <div
                                        key={index}
                                        className={styles.dropdownItem}
                                        onClick={() =>
                                            selectOption(
                                                "destination",
                                                route.arrival_airport
                                                    ?.airport_name,
                                            )
                                        }
                                    >
                                        {route.arrival_airport?.airport_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 3 */}
                <div className={styles.row}>
                    <div
                        className={`${styles.inputGroup} ${styles.datePickerInputGroup}`}
                        style={{
                            zIndex:
                                dropdowns.departure ||
                                dropdowns.destination ||
                                dropdowns.airline ||
                                dropdowns.seatClass
                                    ? 1
                                    : 2000,
                        }}
                    >
                        <DatePicker
                            selected={
                                formData.date ? new Date(formData.date) : null
                            }
                            onChange={(date) => {
                                const year = date.getFullYear();
                                const month = (date.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0"); // Tháng từ 0-11, nên +1
                                const day = date
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0");
                                const formattedDate = `${year}-${month}-${day}`;
                                setFormData({
                                    ...formData,
                                    date: formattedDate,
                                });
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Ngày bay (dd/mm/yyyy)"
                            className={styles.input}
                            popperProps={{
                                positionFixed: true,
                                strategy: "fixed",
                                modifiers: [
                                    {
                                        name: "offset",
                                        options: {
                                            offset: [0, 10],
                                        },
                                    },
                                    {
                                        name: "preventOverflow",
                                        options: {
                                            rootBoundary: "viewport",
                                            tether: false,
                                            altAxis: true,
                                        },
                                    },
                                ],
                            }}
                            popperClassName="date-picker-popper"
                            wrapperClassName="date-picker-wrapper"
                        />
                        <Calendar className={styles.inputIcon} size={20} />
                    </div>

                    {/* Time */}
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={formData.time}
                            onChange={(e) =>
                                handleInputChange("time", e.target.value)
                            }
                            className={styles.input}
                            placeholder="Thời gian bay (hh:mm)"
                        />
                        <Clock className={styles.inputIcon} size={20} />
                    </div>
                </div>

                {/* Row 4 - Total Seats */}
                <div className={styles.row}>
                    {/* Total Seats */}
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={formData.totalSeats}
                            onChange={(e) =>
                                handleInputChange("totalSeats", e.target.value)
                            }
                            className={styles.input}
                            placeholder="Số lượng ghế"
                        />
                        <Users className={styles.inputIcon} size={20} />
                    </div>
                    {/* Flight Duration */}
                    <div className={styles.inputGroup}>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) =>
                                handleInputChange("duration", e.target.value)
                            }
                            className={styles.input}
                            placeholder="Thời gian bay"
                        />
                        <Plane className={styles.inputIcon} size={20} />
                    </div>
                </div>

                {/* Seat Classes Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableHeaderCell}>Hạng ghế</div>
                        <div className={styles.tableHeaderCell}>
                            Số lượng vé
                        </div>
                        <div className={styles.tableHeaderCell}>Thao tác</div>
                    </div>

                    {formData.seatClasses?.map((seatClass, index) => (
                        <div key={index} className={styles.tableRow}>
                            <div className={styles.tableCell}>
                                {seatClass.class}
                            </div>
                            <div className={styles.tableCell}>
                                {seatClass.quantity}
                            </div>
                            <div className={styles.tableCell}>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => {
                                        // Xóa khỏi formData.seatClasses
                                        setFormData((prev) => ({
                                            ...prev,
                                            seatClasses:
                                                prev.seatClasses.filter(
                                                    (_, i) => i !== index,
                                                ),
                                        }));
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Seat Class Row */}
                    <div className={styles.tableRow}>
                        <div className={styles.tableCell}>
                            <div
                                className={styles.dropdown}
                                ref={(el) =>
                                    (dropdownRefs.current.seatClass = el)
                                }
                                style={{
                                    zIndex: dropdowns.seatClass ? 2500 : 1000,
                                }}
                            >
                                <button
                                    className={`${styles.ticketClass} ${newSeatClass.class ? styles.airlineButton : ""}`}
                                    onClick={() => toggleDropdown("seatClass")}
                                >
                                    {newSeatClass.class || "..."}
                                    {newSeatClass.class ? (
                                        <X
                                            size={16}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNewSeatClass((prev) => ({
                                                    ...prev,
                                                    class: "",
                                                }));
                                            }}
                                            className={styles.clearIcon}
                                        />
                                    ) : (
                                        <ChevronDown size={16} />
                                    )}
                                </button>
                                {dropdowns.seatClass &&
                                    (seatClassData.filter(
                                        (option) =>
                                            !formData.seatClasses.some(
                                                (seatClass) =>
                                                    seatClass.class === option,
                                            ),
                                    ).length > 0 ? (
                                        <div className={styles.dropdownMenu}>
                                            {seatClassData
                                                .filter(
                                                    (option) =>
                                                        !formData.seatClasses.some(
                                                            (seatClass) =>
                                                                seatClass.class ===
                                                                option,
                                                        ),
                                                )
                                                .map((option) => (
                                                    <div
                                                        key={option}
                                                        className={
                                                            styles.dropdownItem
                                                        }
                                                        onClick={() => {
                                                            setNewSeatClass(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    class: option,
                                                                }),
                                                            );
                                                            setDropdowns(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    seatClass: false,
                                                                }),
                                                            );
                                                        }}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className={styles.dropdownMenu}>
                                            <div
                                                className={`${styles.dropdownItem} ${styles.disabledItem}`}
                                            >
                                                Không còn hạng vé nào để chọn
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="number"
                                value={newSeatClass.quantity}
                                onChange={(e) =>
                                    setNewSeatClass((prev) => ({
                                        ...prev,
                                        quantity: e.target.value,
                                    }))
                                }
                                className={styles.quantityInput}
                                placeholder="..."
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <button
                                className={styles.addButton}
                                onClick={() => {
                                    if (
                                        newSeatClass.class &&
                                        newSeatClass.quantity
                                    ) {
                                        const newSeatClassEntry = {
                                            ...newSeatClass,
                                        };
                                        setFormData((prev) => ({
                                            ...prev,
                                            seatClasses: [
                                                ...prev.seatClasses,
                                                newSeatClassEntry,
                                            ],
                                        }));
                                        setNewSeatClass({
                                            class: "",
                                            quantity: "",
                                        });
                                        setDropdowns((prev) => ({
                                            ...prev,
                                            seatClass: false,
                                        }));
                                    }
                                }}
                            >
                                <Plus size={16} />
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        className={styles.saveButton}
                        onClick={handleUpdate}
                    >
                        Sửa chuyến bay
                    </button>
                </div>
            </div>
        </div>
    );
}
