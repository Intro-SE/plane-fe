import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Plus, Trash2, RotateCcw } from "lucide-react";
import styles from "./RegulationForm.module.css";
import AirportDetail from "../../DetailToggle/Airport/AirportDetail";
import TicketClassDetail from "../../DetailToggle/TicketClass/TicketClassDetail";
import FlightRouteDetail from "../../DetailToggle/FlightRoute/FlightRouteDetail";

export default function RegulationForm({ setOpenForm }) {
    const [flightRulesOpen, setFlightRulesOpen] = useState(false);
    const [timeRulesOpen, setTimeRulesOpen] = useState(false);
    const [ticketRulesOpen, setTicketRulesOpen] = useState(false);

    // Original values to compare against
    const [originalFlightData] = useState({
        passengers: 10,
        maxFlightTime: 30,
        avgFlightTime: 2,
        maxStopTime: 10,
        maxTotalTime: 20,
        earliestBooking: 24,
        latestCancellation: 24,
        airlines: 2,
    });

    const [flightData, setFlightData] = useState({
        passengers: 10,
        maxFlightTime: 30,
        avgFlightTime: 2,
        maxStopTime: 10,
        maxTotalTime: 20,
        earliestBooking: 24,
        latestCancellation: 24,
        airlines: 2,
    });

    // Track which fields have been modified
    const [modifiedFields, setModifiedFields] = useState({});

    const [ticketClasses, setTicketClasses] = useState([
        {
            code: "SG-HN",
            airline: "Phổ thông",
            price: "1500000",
        },
        {
            code: "HUE-DBP",
            airline: "Thương gia",
            price: "2500000",
        },
        {
            code: "DN-CM",
            airline: "Cao Cấp",
            price: "3800000",
        },
    ]);

    const [newTicket, setNewTicket] = useState({
        code: "",
        airline: "",
        price: "",
    });

    const [dropdowns, setDropdowns] = useState({
        ticketClass: false,
        flightCode: false,
    });

    const dropdownRefs = useRef({});

    const handleInputChange = (field, value) => {
        setFlightData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Mark field as modified if value is different from original
        if (value !== originalFlightData[field]) {
            setModifiedFields((prev) => ({
                ...prev,
                [field]: true,
            }));
        } else {
            // If value matches original, remove from modified fields
            setModifiedFields((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    // Reset a field to its original value
    const resetField = (field) => {
        setFlightData((prev) => ({
            ...prev,
            [field]: originalFlightData[field],
        }));

        // Remove from modified fields
        setModifiedFields((prev) => {
            const updated = { ...prev };
            delete updated[field];
            return updated;
        });
    };

    const toggleDropdown = (dropdown) => {
        // Close all other dropdowns first
        const newDropdownState = Object.keys(dropdowns).reduce((acc, key) => {
            acc[key] = key === dropdown ? !dropdowns[key] : false;
            return acc;
        }, {});

        setDropdowns(newDropdownState);
    };

    const clearSelection = (field, event) => {
        event.stopPropagation();
        setNewTicket((prev) => ({
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

    // No need to reposition dropdowns as they use absolute positioning
    useEffect(() => {
        // This effect is kept to prevent breaking changes
        // but the repositioning logic is removed
    }, [dropdowns]);

    const handleNewTicketChange = (field, value) => {
        setNewTicket((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const addTicket = () => {
        if (newTicket.code && newTicket.airline && newTicket.price) {
            setTicketClasses((prev) => [...prev, newTicket]);
            setNewTicket({
                code: "",
                airline: "",
                price: "",
            });
        }
    };

    const removeTicket = (index) => {
        setTicketClasses((prev) => prev.filter((_, i) => i !== index));
    };

    const ticketClassOptions = ["Phổ thông", "Thương gia", "Cao Cấp", "VIP"];
    const flightCodeOptions = [
        "SG-HN",
        "HUE-DBP",
        "DN-CM",
        "HN-SG",
        "DN-HN",
        "CM-SG",
    ];

    return (
        <div className={styles.container}>
            {/* Flight Rules Section */}
            <div className={styles.section}>
                <div
                    className={styles.sectionHeader}
                    onClick={() => setFlightRulesOpen(!flightRulesOpen)}
                >
                    <span>THAY ĐỔI QUY ĐỊNH CHUYẾN BAY</span>
                    <span
                        className={`${styles.arrow} ${flightRulesOpen ? styles.open : ""}`}
                    >
                        <ChevronDown size={16} />
                    </span>
                </div>

                {flightRulesOpen && (
                    <div className={styles.sectionContent}>
                        <div className={styles.formRow}>
                            <label>Số lượng sân bay</label>
                            <div className={styles.inputGroup}>
                                <span
                                    className={styles.detailLink}
                                    onClick={() => setOpenForm("airport")}
                                >
                                    Xem chi tiết sân bay
                                </span>
                                <div className={styles.inputWithReset}>
                                    <input
                                        type="number"
                                        value={flightData.passengers}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "passengers",
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            modifiedFields.passengers
                                                ? styles.modifiedInput
                                                : ""
                                        }
                                    />
                                    {modifiedFields.passengers && (
                                        <div
                                            className={styles.modifiedIndicator}
                                        >
                                            <span className={styles.oldValue}>
                                                Giá trị cũ:{" "}
                                                {originalFlightData.passengers}
                                            </span>
                                            <button
                                                className={styles.resetButton}
                                                onClick={() =>
                                                    resetField("passengers")
                                                }
                                                title="Hoàn tác thay đổi"
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>Thời gian bay tối thiểu (phút)</label>
                            <div className={styles.inputWithReset}>
                                <input
                                    type="number"
                                    value={flightData.maxFlightTime}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "maxFlightTime",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.maxFlightTime
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.maxFlightTime && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {originalFlightData.maxFlightTime}
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField("maxFlightTime")
                                            }
                                            title="Hoàn tác thay đổi"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>SỐ SÂN BAY TRUNG GIAN TỐI ĐA</label>
                            <div className={styles.inputGroup}>
                                <span
                                    className={styles.detailLink}
                                    onClick={() => setOpenForm("flightRoute")}
                                >
                                    Xem chi tiết tuyến bay
                                </span>
                                <div className={styles.inputWithReset}>
                                    <input
                                        type="number"
                                        value={flightData.avgFlightTime}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "avgFlightTime",
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            modifiedFields.avgFlightTime
                                                ? styles.modifiedInput
                                                : ""
                                        }
                                    />
                                    {modifiedFields.avgFlightTime && (
                                        <div
                                            className={styles.modifiedIndicator}
                                        >
                                            <span className={styles.oldValue}>
                                                Giá trị cũ:{" "}
                                                {
                                                    originalFlightData.avgFlightTime
                                                }
                                            </span>
                                            <button
                                                className={styles.resetButton}
                                                onClick={() =>
                                                    resetField("avgFlightTime")
                                                }
                                                title="Hoàn tác thay đổi"
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>THỜI GIAN DỪNG TỐI THIỂU (PHÚT)</label>
                            <div className={styles.inputWithReset}>
                                <input
                                    type="number"
                                    value={flightData.maxStopTime}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "maxStopTime",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.maxStopTime
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.maxStopTime && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {originalFlightData.maxStopTime}
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField("maxStopTime")
                                            }
                                            title="Hoàn tác thay đổi"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>THỜI GIAN DỪNG TỐI ĐA (PHÚT)</label>
                            <div className={styles.inputWithReset}>
                                <input
                                    type="number"
                                    value={flightData.maxTotalTime}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "maxTotalTime",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.maxTotalTime
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.maxTotalTime && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {originalFlightData.maxTotalTime}
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField("maxTotalTime")
                                            }
                                            title="Hoàn tác thay đổi"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Time Rules Section */}
            <div className={styles.section}>
                <div
                    className={styles.sectionHeader}
                    onClick={() => setTimeRulesOpen(!timeRulesOpen)}
                >
                    <span>THAY ĐỔI QUY ĐỊNH THỜI GIAN</span>
                    <span
                        className={`${styles.arrow} ${timeRulesOpen ? styles.open : ""}`}
                    >
                        <ChevronDown size={16} />
                    </span>
                </div>

                {timeRulesOpen && (
                    <div className={styles.sectionContent}>
                        <div className={styles.formRow}>
                            <label>THỜI GIAN CHẬM NHẤT KHI ĐẶT VÉ (GIỜ)</label>
                            <div className={styles.inputWithReset}>
                                <input
                                    type="number"
                                    value={flightData.earliestBooking}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "earliestBooking",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.earliestBooking
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.earliestBooking && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {originalFlightData.earliestBooking}
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField("earliestBooking")
                                            }
                                            title="Hoàn tác thay đổi"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>THỜI GIAN CHẬM NHẤT KHI HỦY VÉ (GIỜ)</label>
                            <div className={styles.inputWithReset}>
                                <input
                                    type="number"
                                    value={flightData.latestCancellation}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "latestCancellation",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.latestCancellation
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.latestCancellation && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {
                                                originalFlightData.latestCancellation
                                            }
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField("latestCancellation")
                                            }
                                            title="Hoàn tác thay đổi"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Ticket Rules Section */}
            <div className={styles.section}>
                <div
                    className={styles.sectionHeader}
                    onClick={() => setTicketRulesOpen(!ticketRulesOpen)}
                >
                    <span>THAY ĐỔI QUY ĐỊNH VÉ</span>
                    <span
                        className={`${styles.arrow} ${ticketRulesOpen ? styles.open : ""}`}
                    >
                        <ChevronDown size={16} />
                    </span>
                </div>

                {ticketRulesOpen && (
                    <div className={styles.sectionContent}>
                        <div className={styles.formRow}>
                            <label>SỐ LƯỢNG CÁC HÃNG VÉ</label>
                            <div className={styles.inputGroup}>
                                <span
                                    className={styles.detailLink}
                                    onClick={() => setOpenForm("ticketClass")}
                                >
                                    Xem chi tiết hãng vé
                                </span>
                                <div className={styles.inputWithReset}>
                                    <input
                                        type="number"
                                        value={flightData.airlines}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "airlines",
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            modifiedFields.airlines
                                                ? styles.modifiedInput
                                                : ""
                                        }
                                    />
                                    {modifiedFields.airlines && (
                                        <div
                                            className={styles.modifiedIndicator}
                                        >
                                            <span className={styles.oldValue}>
                                                Giá trị cũ:{" "}
                                                {originalFlightData.airlines}
                                            </span>
                                            <button
                                                className={styles.resetButton}
                                                onClick={() =>
                                                    resetField("airlines")
                                                }
                                                title="Hoàn tác thay đổi"
                                            >
                                                <RotateCcw size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Flight Table */}
                        <div className={styles.tableContainer}>
                            <div className={styles.tableHeader}>
                                <div className={styles.tableHeaderCell}>
                                    Mã tuyến bay
                                </div>
                                <div className={styles.tableHeaderCell}>
                                    Hạng vé
                                </div>
                                <div className={styles.tableHeaderCell}>
                                    Đơn giá (VND)
                                </div>
                                <div className={styles.tableHeaderCell}>
                                    Thao tác
                                </div>
                            </div>

                            {/* Existing Ticket Classes */}
                            {ticketClasses.map((ticket, index) => (
                                <div key={index} className={styles.tableRow}>
                                    <div className={styles.tableCell}>
                                        {ticket.code}
                                    </div>
                                    <div className={styles.tableCell}>
                                        {ticket.airline}
                                    </div>
                                    <div className={styles.tableCell}>
                                        {parseInt(ticket.price).toLocaleString(
                                            "vi-VN",
                                        )}
                                    </div>
                                    <div className={styles.tableCell}>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => removeTicket(index)}
                                        >
                                            <Trash2 size={16} />
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add New Ticket Class Row */}
                            <div className={styles.tableRow}>
                                <div
                                    className={styles.tableCell}
                                    style={{ overflow: "visible" }}
                                >
                                    <div
                                        className={styles.dropdown}
                                        ref={(el) =>
                                            (dropdownRefs.current.flightCode =
                                                el)
                                        }
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                        }}
                                    >
                                        <button
                                            className={`${styles.ticketClass} ${newTicket.code ? styles.airlineButton : ""}`}
                                            onClick={() =>
                                                toggleDropdown("flightCode")
                                            }
                                        >
                                            {newTicket.code || "..."}
                                            {newTicket.code ? (
                                                <X
                                                    size={16}
                                                    onClick={(e) =>
                                                        clearSelection(
                                                            "code",
                                                            e,
                                                        )
                                                    }
                                                    className={styles.clearIcon}
                                                />
                                            ) : (
                                                <ChevronDown size={16} />
                                            )}
                                        </button>
                                        {dropdowns.flightCode && (
                                            <div
                                                className={styles.dropdownMenu}
                                            >
                                                {flightCodeOptions.map(
                                                    (option, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={
                                                                styles.dropdownItem
                                                            }
                                                            onClick={() => {
                                                                handleNewTicketChange(
                                                                    "code",
                                                                    option,
                                                                );
                                                                toggleDropdown(
                                                                    "flightCode",
                                                                );
                                                            }}
                                                        >
                                                            {option}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={styles.tableCell}
                                    style={{ overflow: "visible" }}
                                >
                                    <div
                                        className={styles.dropdown}
                                        ref={(el) =>
                                            (dropdownRefs.current.ticketClass =
                                                el)
                                        }
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                        }}
                                    >
                                        <button
                                            className={`${styles.ticketClass} ${newTicket.airline ? styles.airlineButton : ""}`}
                                            onClick={() =>
                                                toggleDropdown("ticketClass")
                                            }
                                        >
                                            {newTicket.airline || "..."}
                                            {newTicket.airline ? (
                                                <X
                                                    size={16}
                                                    onClick={(e) =>
                                                        clearSelection(
                                                            "airline",
                                                            e,
                                                        )
                                                    }
                                                    className={styles.clearIcon}
                                                />
                                            ) : (
                                                <ChevronDown size={16} />
                                            )}
                                        </button>
                                        {dropdowns.ticketClass && (
                                            <div
                                                className={styles.dropdownMenu}
                                            >
                                                {ticketClassOptions.map(
                                                    (option, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={
                                                                styles.dropdownItem
                                                            }
                                                            onClick={() => {
                                                                handleNewTicketChange(
                                                                    "airline",
                                                                    option,
                                                                );
                                                                toggleDropdown(
                                                                    "ticketClass",
                                                                );
                                                            }}
                                                        >
                                                            {option}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <input
                                        type="number"
                                        value={newTicket.price}
                                        onChange={(e) =>
                                            handleNewTicketChange(
                                                "price",
                                                e.target.value,
                                            )
                                        }
                                        className={styles.quantityInput}
                                        placeholder="..."
                                    />
                                </div>
                                <div className={styles.tableCell}>
                                    <button
                                        className={styles.addButton}
                                        onClick={addTicket}
                                    >
                                        <Plus size={16} />
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
                <button className={styles.cancelBtn}>Hủy</button>
                <button className={styles.confirmBtn}>Xác nhận</button>
            </div>
        </div>
    );
}
