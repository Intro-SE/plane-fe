import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Plus, Trash2, RotateCcw } from "lucide-react";
import styles from "./RegulationForm.module.css";
import axios from "axios";

export default function RegulationForm({ setToast, setOpenForm }) {
    const [flightRulesOpen, setFlightRulesOpen] = useState(false);
    const [timeRulesOpen, setTimeRulesOpen] = useState(false);
    const [ticketRulesOpen, setTicketRulesOpen] = useState(false);

    const [originalRegulations, setOriginalRegulations] = useState({
        airport_number: "",
        min_flight_duration: "",
        max_stop_number: "",
        min_stop_duration: "",
        max_stop_duration: "",
        latest_time_to_book: "",
        latest_time_to_cancel: "",
        ticket_class_number: "",
    });

    const [regulationData, setRegulationData] = useState({
        airport_number: "",
        min_flight_duration: "",
        max_stop_number: "",
        min_stop_duration: "",
        max_stop_duration: "",
        latest_time_to_book: "",
        latest_time_to_cancel: "",
        ticket_class_number: "",
    });

    const [ticketClasses, setTicketClasses] = useState([]);

    const [ticketClassOptions, setTicketClassOptions] = useState([]);
    const [flightRouteOptions, setFlightRouteOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    regulationRes,
                    ticketClassRouteRes,
                    ticketClassOptionRes,
                    flightRoutesOptionRes,
                ] = await Promise.all([
                    axios.get(
                        "http://localhost:8000/api/v1/regulation/regulations",
                    ),
                    axios.get(
                        "http://localhost:8000/api/v1/regulation/ticket_class_by_route",
                    ),
                    axios.get(
                        "http://localhost:8000/api/v1/regulation/get_ticket_class",
                    ),
                    axios.get("http://localhost:8000/api/v1/flightroutes_crud"),
                ]);

                setOriginalRegulations(regulationRes.data);
                setRegulationData(regulationRes.data);
                setTicketClasses(ticketClassRouteRes.data);
                const ticketClassNames = ticketClassOptionRes.data.map(
                    (item) => item.ticket_class_name,
                );
                setTicketClassOptions(ticketClassNames);
                const flightRoutes = flightRoutesOptionRes.data.map(
                    (item) => item.flight_route_id,
                );
                setFlightRouteOptions(flightRoutes);
            } catch (error) {
                console.log(
                    "Lỗi khi lấy dữ liệu:",
                    error.response?.data || error.message,
                );
            }
        };

        fetchData();
    }, []);

    const [modifiedFields, setModifiedFields] = useState({});

    const [newTicketClasses, setNewTicketClasses] = useState([]);

    const [newTicket, setNewTicket] = useState({
        flight_route_id: "",
        ticket_class_name: "",
        price: "",
    });

    const [dropdowns, setDropdowns] = useState({
        ticketClass: false,
        flightCode: false,
    });

    const dropdownRefs = useRef({});

    const handleInputChange = (field, value) => {
        setRegulationData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Mark field as modified if value is different from original
        if (value !== originalRegulations[field]) {
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
        setRegulationData((prev) => ({
            ...prev,
            [field]: originalRegulations[field],
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
        if (
            newTicket.flight_route_id &&
            newTicket.ticket_class_name &&
            newTicket.price
        ) {
            const newTicketEntry = { ...newTicket };
            setTicketClasses((prev) => [...prev, newTicketEntry]);
            setNewTicketClasses((prev) => [...prev, newTicketEntry]);
            setNewTicket({
                flight_route_id: "",
                ticket_class_name: "",
                price: "",
            });
        }
    };

    const removeTicket = (index, ticket) => {
        if (
            newTicketClasses.some(
                (item) =>
                    item.flight_route_id === ticket.flight_route_id &&
                    item.ticket_class_name === ticket.ticket_class_name &&
                    item.price === ticket.price,
            )
        ) {
            setTicketClasses((prev) => prev.filter((_, i) => i !== index));
            setNewTicketClasses((prev) =>
                prev.filter(
                    (item) =>
                        !(
                            item.flight_route_id === ticket.flight_route_id &&
                            item.ticket_class_name ===
                                ticket.ticket_class_name &&
                            item.price === ticket.price
                        ),
                ),
            );
        }
    };

    const handleConfirm = async () => {
        try {
            const updateRulePromise = axios.put(
                "http://localhost:8000/api/v1/regulation/update_rule",
                regulationData,
            );

            const ticketClassPromise = (async () => {
                for (const ticket_class of newTicketClasses) {
                    await axios.post(
                        "http://localhost:8000/api/v1/regulation/create_ticket_class_by_route",
                        ticket_class,
                    );
                }
            })();

            const [updateRegulationRes] = await Promise.all([
                updateRulePromise,
                ticketClassPromise,
            ]);

            // Cập nhật state sau khi xong cả hai
            setOriginalRegulations(updateRegulationRes.data);
            setRegulationData(updateRegulationRes.data);
            setModifiedFields({});
            setNewTicketClasses([]);

            setToast({
                show: true,
                type: "success",
                message: "Cập nhật quy định thành công!",
            });
        } catch (error) {
            console.error(
                "Lỗi khi cập nhật:",
                error.response?.data || error.message,
            );
            setToast({
                show: true,
                type: "error",
                message: "Cập nhật quy định không thành công!",
            });
        }
    };

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
                                        value={regulationData.airport_number}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "airport_number",
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            modifiedFields.airport_number
                                                ? styles.modifiedInput
                                                : ""
                                        }
                                    />
                                    {modifiedFields.airport_number && (
                                        <div
                                            className={styles.modifiedIndicator}
                                        >
                                            <span className={styles.oldValue}>
                                                Giá trị cũ:{" "}
                                                {
                                                    originalRegulations.airport_number
                                                }
                                            </span>
                                            <button
                                                className={styles.resetButton}
                                                onClick={() =>
                                                    resetField("airport_number")
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
                                    value={regulationData.min_flight_duration}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "min_flight_duration",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.min_flight_duration
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.min_flight_duration && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {
                                                originalRegulations.min_flight_duration
                                            }
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField(
                                                    "min_flight_duration",
                                                )
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
                                        value={regulationData.max_stop_number}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "max_stop_number",
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            modifiedFields.max_stop_number
                                                ? styles.modifiedInput
                                                : ""
                                        }
                                    />
                                    {modifiedFields.max_stop_number && (
                                        <div
                                            className={styles.modifiedIndicator}
                                        >
                                            <span className={styles.oldValue}>
                                                Giá trị cũ:{" "}
                                                {
                                                    originalRegulations.max_stop_number
                                                }
                                            </span>
                                            <button
                                                className={styles.resetButton}
                                                onClick={() =>
                                                    resetField(
                                                        "max_stop_number",
                                                    )
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
                                    value={regulationData.min_stop_duration}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "min_stop_duration",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.min_stop_duration
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.min_stop_duration && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {
                                                originalRegulations.min_stop_duration
                                            }
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField("min_stop_duration")
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
                                    value={regulationData.max_stop_duration}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "max_stop_duration",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.max_stop_duration
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.max_stop_duration && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {
                                                originalRegulations.max_stop_duration
                                            }
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField("max_stop_duration")
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
                                    value={regulationData.latest_time_to_book}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "latest_time_to_book",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.latest_time_to_book
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.latest_time_to_book && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {
                                                originalRegulations.latest_time_to_book
                                            }
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField(
                                                    "latest_time_to_book",
                                                )
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
                                    value={regulationData.latest_time_to_cancel}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "latest_time_to_cancel",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        modifiedFields.latest_time_to_cancel
                                            ? styles.modifiedInput
                                            : ""
                                    }
                                />
                                {modifiedFields.latest_time_to_cancel && (
                                    <div className={styles.modifiedIndicator}>
                                        <span className={styles.oldValue}>
                                            Giá trị cũ:{" "}
                                            {
                                                originalRegulations.latest_time_to_cancel
                                            }
                                        </span>
                                        <button
                                            className={styles.resetButton}
                                            onClick={() =>
                                                resetField(
                                                    "latest_time_to_cancel",
                                                )
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
                            <label>SỐ LƯỢNG CÁC HẠNG VÉ (CỦA TUYẾN BAY)</label>
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
                                        value={
                                            regulationData.ticket_class_number
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                "ticket_class_number",
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            modifiedFields.ticket_class_number
                                                ? styles.modifiedInput
                                                : ""
                                        }
                                    />
                                    {modifiedFields.ticket_class_number && (
                                        <div
                                            className={styles.modifiedIndicator}
                                        >
                                            <span className={styles.oldValue}>
                                                Giá trị cũ:{" "}
                                                {
                                                    originalRegulations.ticket_class_number
                                                }
                                            </span>
                                            <button
                                                className={styles.resetButton}
                                                onClick={() =>
                                                    resetField(
                                                        "ticket_class_number",
                                                    )
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
                                        {ticket.flight_route_id}
                                    </div>
                                    <div className={styles.tableCell}>
                                        {ticket.ticket_class_name}
                                    </div>
                                    <div className={styles.tableCell}>
                                        {parseInt(ticket.price).toLocaleString(
                                            "vi-VN",
                                        )}
                                    </div>
                                    <div className={styles.tableCell}>
                                        <button
                                            className={`${styles.deleteButton} ${
                                                !newTicketClasses.some(
                                                    (item) =>
                                                        item.flight_route_id ===
                                                            ticket.flight_route_id &&
                                                        item.ticket_class_name ===
                                                            ticket.ticket_class_name &&
                                                        item.price ===
                                                            ticket.price,
                                                )
                                                    ? styles.disabledButton
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                newTicketClasses.some(
                                                    (item) =>
                                                        item.flight_route_id ===
                                                            ticket.flight_route_id &&
                                                        item.ticket_class_name ===
                                                            ticket.ticket_class_name &&
                                                        item.price ===
                                                            ticket.price,
                                                ) && removeTicket(index, ticket)
                                            }
                                            disabled={
                                                !newTicketClasses.some(
                                                    (item) =>
                                                        item.flight_route_id ===
                                                            ticket.flight_route_id &&
                                                        item.ticket_class_name ===
                                                            ticket.ticket_class_name &&
                                                        item.price ===
                                                            ticket.price,
                                                )
                                            }
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
                                            className={`${styles.ticketClass} ${newTicket.flight_route_id ? styles.airlineButton : ""}`}
                                            onClick={() =>
                                                toggleDropdown("flightCode")
                                            }
                                        >
                                            {newTicket.flight_route_id || "..."}
                                            {newTicket.flight_route_id ? (
                                                <X
                                                    size={16}
                                                    onClick={(e) =>
                                                        clearSelection(
                                                            "flight_route_id",
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
                                                {flightRouteOptions.map(
                                                    (option, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={
                                                                styles.dropdownItem
                                                            }
                                                            onClick={() => {
                                                                handleNewTicketChange(
                                                                    "flight_route_id",
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
                                            className={`${styles.ticketClass} ${newTicket.ticket_class_name ? styles.airlineButton : ""}`}
                                            onClick={() =>
                                                toggleDropdown("ticketClass")
                                            }
                                        >
                                            {newTicket.ticket_class_name ||
                                                "..."}
                                            {newTicket.ticket_class_name ? (
                                                <X
                                                    size={16}
                                                    onClick={(e) =>
                                                        clearSelection(
                                                            "ticket_class_name",
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
                                                                    "ticket_class_name",
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
                <button className={styles.confirmBtn} onClick={handleConfirm}>
                    Xác nhận
                </button>
            </div>
        </div>
    );
}
