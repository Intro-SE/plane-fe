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
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddFlightForm.module.css";

export default function AddFlightForm({
    onClose,
    routeData,
    seatClassData,
    onSendData,
}) {
    const [formData, setFormData] = useState({
        flightCode: "",
        airline: "",
        departure: "",
        destination: "",
        date: "",
        time: "",
        totalSeats: "",
        seatClasses: [],
    });

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
        setFormData((prev) => ({
            ...prev,
            [field]: "",
        }));
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

    const handleSave = () => {
        const data = {
            flightCode: formData.flightCode,
            route: formData.airline,
            departure: formData.departure,
            arrival: formData.destination,
            date: formData.date,
            time: formData.time,
            totalSeats: formData.totalSeats,
            seatClasses: formData.seatClasses,
        };
        console.log(data);
        onSendData(data);
        onClose();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Biểu mẫu thêm một chuyến bay mới</h2>
            </div>

            <div className={styles.form}>
                {/* Row 1 */}
                <div className={styles.row}>
                    {/* Flight Code */}
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={formData.flightCode}
                            onChange={(e) =>
                                handleInputChange("flightCode", e.target.value)
                            }
                            className={styles.input}
                            placeholder="Mã chuyến bay"
                        />
                        <Plane className={styles.inputIcon} size={20} />
                    </div>

                    {/* Airline Dropdown */}
                    <div
                        className={styles.dropdown}
                        ref={(el) => (dropdownRefs.current.airline = el)}
                    >
                        <button
                            className={`${styles.dropdownButton} ${formData.airline ? styles.airlineButton : ""}`}
                            onClick={() => toggleDropdown("airline")}
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
                                    const departure =
                                        route.departure_airport?.airport_id ||
                                        "Unknown Departure";
                                    const arrival =
                                        route.arrival_airport?.airport_id ||
                                        "Unknown Arrival";
                                    const routeName = `${departure} - ${arrival}`;

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
                                                });
                                                selectOption(
                                                    "airline",
                                                    routeName,
                                                );
                                            }}
                                        >
                                            {routeName}
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
                    >
                        <button
                            className={`${styles.dropdownButton} ${formData.departure ? styles.airlineButton : ""}`}
                            onClick={() => toggleDropdown("departure")}
                        >
                            {formData.departure || "Sân bay đi"}
                            {formData.departure ? (
                                <X
                                    size={20}
                                    onClick={(e) =>
                                        clearSelection("departure", e)
                                    }
                                    className={styles.clearIcon}
                                />
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
                    >
                        <button
                            className={`${styles.dropdownButton} ${formData.destination ? styles.airlineButton : ""}`}
                            onClick={() => toggleDropdown("destination")}
                        >
                            {formData.destination || "Sân bay đến"}
                            {formData.destination ? (
                                <X
                                    size={20}
                                    onClick={(e) =>
                                        clearSelection("destination", e)
                                    }
                                    className={styles.clearIcon}
                                />
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
                    <div className={styles.inputGroup}>
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
                            }}
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

                {/* Seat Classes Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableHeaderCell}>Hạng ghế</div>
                        <div className={styles.tableHeaderCell}>
                            Số lượng vé
                        </div>
                        <div className={styles.tableHeaderCell}>Thao tác</div>
                    </div>

                    {formData.seatClasses.map((seatClass, index) => (
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
                                {dropdowns.seatClass && (
                                    <div className={styles.dropdownMenu}>
                                        {seatClassData.map((option) => (
                                            <div
                                                key={option}
                                                className={styles.dropdownItem}
                                                onClick={() => {
                                                    setNewSeatClass((prev) => ({
                                                        ...prev,
                                                        class: option,
                                                    }));
                                                    setDropdowns((prev) => ({
                                                        ...prev,
                                                        seatClass: false,
                                                    }));
                                                }}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                        setFormData((prev) => ({
                                            ...prev,
                                            seatClasses: [
                                                ...prev.seatClasses,
                                                newSeatClass,
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
                    <button className={styles.saveButton} onClick={handleSave}>
                        Thêm chuyến bay
                    </button>
                </div>
            </div>
        </div>
    );
}
