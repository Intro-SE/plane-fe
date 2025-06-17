import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Plus, Trash2 } from "lucide-react";
import styles from "./RegulationForm.module.css";
import AirportDetail from "../../DetailToggle/Airport/AirportDetail";
import TicketClassDetail from "../../DetailToggle/TicketClass/TicketClassDetail";
import FlightRouteDetail from "../../DetailToggle/FlightRoute/FlightRouteDetail";

export default function RegulationForm() {
    const [flightRulesOpen, setFlightRulesOpen] = useState(false);
    const [timeRulesOpen, setTimeRulesOpen] = useState(false);
    const [ticketRulesOpen, setTicketRulesOpen] = useState(false);

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

    const [menuPositions, setMenuPositions] = useState({
        ticketClass: { top: 0, left: 0, width: 0 },
        flightCode: { top: 0, left: 0, width: 0 },
    });

    const dropdownRefs = useRef({});

    const handleInputChange = (field, value) => {
        setFlightData((prev) => ({
            ...prev,
            [field]: value,
        }));
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
            <FlightRouteDetail />
            {/* Flight Rules Section */}
            <div className={styles.section}>
                <div
                    className={styles.sectionHeader}
                    onClick={() => setFlightRulesOpen(!flightRulesOpen)}
                >
                    <span>Thay đổi quy định chuyến bay</span>
                    <span
                        className={`${styles.arrow} ${flightRulesOpen ? styles.open : ""}`}
                    >
                        ▼
                    </span>
                </div>

                {flightRulesOpen && (
                    <div className={styles.sectionContent}>
                        <div className={styles.formRow}>
                            <label>SỐ LƯỢNG SÂN BAY</label>
                            <div className={styles.inputGroup}>
                                <span className={styles.detailLink}>
                                    Xem chi tiết sân bay
                                </span>
                                <input
                                    type="number"
                                    value={flightData.passengers}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "passengers",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>THỜI GIAN BAY TỐI THIỂU</label>
                            <input
                                type="number"
                                value={flightData.maxFlightTime}
                                onChange={(e) =>
                                    handleInputChange(
                                        "maxFlightTime",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label>SỐ SÂN BAY TRUNG GIAN TỐI ĐA</label>
                            <div className={styles.inputGroup}>
                                <span className={styles.detailLink}>
                                    Xem chi tiết tuyến bay
                                </span>
                                <input
                                    type="number"
                                    value={flightData.avgFlightTime}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "avgFlightTime",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label>THỜI GIAN DỪNG TỐI THIỂU</label>
                            <input
                                type="number"
                                value={flightData.maxStopTime}
                                onChange={(e) =>
                                    handleInputChange(
                                        "maxStopTime",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label>THỜI GIAN DỪNG TỐI ĐA</label>
                            <input
                                type="number"
                                value={flightData.maxTotalTime}
                                onChange={(e) =>
                                    handleInputChange(
                                        "maxTotalTime",
                                        e.target.value,
                                    )
                                }
                            />
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
                    <span>Thay đổi quy định thời gian</span>
                    <span
                        className={`${styles.arrow} ${timeRulesOpen ? styles.open : ""}`}
                    >
                        ▼
                    </span>
                </div>

                {timeRulesOpen && (
                    <div className={styles.sectionContent}>
                        <div className={styles.formRow}>
                            <label>THỜI GIAN CHẬM NHẤT KHI ĐẶT VÉ (GIỜ)</label>
                            <input
                                type="number"
                                value={flightData.earliestBooking}
                                onChange={(e) =>
                                    handleInputChange(
                                        "earliestBooking",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label>THỜI GIAN CHẬM NHẤT KHI HỦY VÉ (GIỜ)</label>
                            <input
                                type="number"
                                value={flightData.latestCancellation}
                                onChange={(e) =>
                                    handleInputChange(
                                        "latestCancellation",
                                        e.target.value,
                                    )
                                }
                            />
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
                    <span>Thay đổi quy định vé</span>
                    <span
                        className={`${styles.arrow} ${ticketRulesOpen ? styles.open : ""}`}
                    >
                        ▼
                    </span>
                </div>

                {ticketRulesOpen && (
                    <div className={styles.sectionContent}>
                        <div className={styles.formRow}>
                            <label>SỐ LƯỢNG CÁC HÃNG VÉ</label>
                            <div className={styles.inputGroup}>
                                <span className={styles.detailLink}>
                                    Xem chi tiết hãng vé
                                </span>
                                <input
                                    type="number"
                                    value={flightData.airlines}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "airlines",
                                            e.target.value,
                                        )
                                    }
                                />
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
