import { useState, useRef, useEffect } from "react";
import {
    ChevronDown,
    X,
    Plus,
    Trash2,
    RotateCcw,
    Edit,
    Save,
} from "lucide-react";
import styles from "./RegulationForm.module.css";
import axios from "axios";

export default function RegulationForm({ setToast, setOpenForm, setLoading }) {
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
    const [newTicketClasses, setNewTicketClasses] = useState([]);
    const [editingTicketClasses, setEditingTicketClasses] = useState({});
    const [modifiedTicketClasses, setModifiedTicketClasses] = useState([]);
    const [originalTicketValues, setOriginalTicketValues] = useState({});
    const [changedTicketClasses, setChangedTicketClasses] = useState({});

    const [ticketClassOptions, setTicketClassOptions] = useState([]);
    const [flightRouteOptions, setFlightRouteOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
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
                const routes = ticketClassRouteRes.data.map((route) => ({
                    flight_route_id: route.flight_route_id,
                    ticket_class_name: route.ticket_class_name,
                    price: route.price,
                    internalId: `internal_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                }));
                setTicketClasses(routes);
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setLoading]);

    const [modifiedFields, setModifiedFields] = useState({});

    const [newTicket, setNewTicket] = useState({
        flight_route_id: "",
        ticket_class_name: "",
        price: "",
    });

    const [dropdowns, setDropdowns] = useState({
        ticketClass: false,
        flightCode: false,
        editFlightCode: {},
        editTicketClass: {},
    });

    const dropdownRefs = useRef({});

    const handleInputChange = (field, value) => {
        setRegulationData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (value !== originalRegulations[field]) {
            setModifiedFields((prev) => ({
                ...prev,
                [field]: true,
            }));
        } else {
            setModifiedFields((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const resetField = (field) => {
        setRegulationData((prev) => ({
            ...prev,
            [field]: originalRegulations[field],
        }));

        setModifiedFields((prev) => {
            const updated = { ...prev };
            delete updated[field];
            return updated;
        });
    };

    const toggleDropdown = (dropdownName, ticketKey = null) => {
        setDropdowns((prev) => {
            const nextState = {};
            let isCurrentlyOpen = false;

            Object.keys(prev).forEach((key) => {
                if (typeof prev[key] === "boolean") {
                    nextState[key] = false;
                } else {
                    nextState[key] = {};
                    Object.keys(prev[key]).forEach((subKey) => {
                        nextState[key][subKey] = false;
                    });
                }
            });

            if (ticketKey) {
                isCurrentlyOpen = prev[dropdownName]?.[ticketKey] || false;
                if (!isCurrentlyOpen) {
                    if (!nextState[dropdownName]) nextState[dropdownName] = {};
                    nextState[dropdownName][ticketKey] = true;
                }
            } else {
                isCurrentlyOpen = prev[dropdownName] || false;
                if (!isCurrentlyOpen) {
                    nextState[dropdownName] = true;
                }
            }
            return nextState;
        });
    };

    const clearSelection = (
        field,
        event,
        dropdownNameToCloseIfSimple = null,
        ticketKeyIfEdit = null,
    ) => {
        event.stopPropagation();
        if (field === "flight_route_id" || field === "ticket_class_name") {
            setNewTicket((prev) => ({
                ...prev,
                [field]: "",
            }));
            if (dropdownNameToCloseIfSimple) {
                setDropdowns((prev) => ({
                    ...prev,
                    [dropdownNameToCloseIfSimple]: false,
                }));
            }
        } else if (field === "editFlightCode" || field === "editTicketClass") {
            const editField =
                field === "editFlightCode"
                    ? "flight_route_id"
                    : "ticket_class_name";
            setEditingTicketClasses((prev) => ({
                ...prev,
                [ticketKeyIfEdit]: {
                    ...prev[ticketKeyIfEdit],
                    [editField]: "",
                },
            }));
            if (ticketKeyIfEdit) {
                setDropdowns((prev) => ({
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [ticketKeyIfEdit]: false,
                    },
                }));
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdownRefs.current).forEach((refKey) => {
                if (
                    dropdownRefs.current[refKey] &&
                    !dropdownRefs.current[refKey].contains(event.target)
                ) {
                    setDropdowns((prevDropdownStates) => {
                        const updatedDropdownStates = { ...prevDropdownStates };

                        if (
                            refKey === "flightCode" ||
                            refKey === "ticketClass"
                        ) {
                            if (prevDropdownStates[refKey] === true) {
                                updatedDropdownStates[refKey] = false;
                            }
                        } else if (refKey.startsWith("editFlightCode_")) {
                            const ticketId = refKey.substring(
                                "editFlightCode_".length,
                            );
                            if (
                                prevDropdownStates.editFlightCode &&
                                prevDropdownStates.editFlightCode[ticketId] ===
                                    true
                            ) {
                                updatedDropdownStates.editFlightCode = {
                                    ...prevDropdownStates.editFlightCode,
                                    [ticketId]: false,
                                };
                            }
                        } else if (refKey.startsWith("editTicketClass_")) {
                            const ticketId = refKey.substring(
                                "editTicketClass_".length,
                            );
                            if (
                                prevDropdownStates.editTicketClass &&
                                prevDropdownStates.editTicketClass[ticketId] ===
                                    true
                            ) {
                                updatedDropdownStates.editTicketClass = {
                                    ...prevDropdownStates.editTicketClass,
                                    [ticketId]: false,
                                };
                            }
                        }
                        return updatedDropdownStates;
                    });
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNewTicketChange = (field, value) => {
        setNewTicket((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const selectOption = (field, value, ticketKey = null) => {
        if (field === "flight_route_id" || field === "ticket_class_name") {
            setNewTicket((prev) => ({
                ...prev,
                [field]: value,
            }));
        } else if (field === "editFlightCode" || field === "editTicketClass") {
            const editField =
                field === "editFlightCode"
                    ? "flight_route_id"
                    : "ticket_class_name";
            setEditingTicketClasses((prev) => ({
                ...prev,
                [ticketKey]: {
                    ...prev[ticketKey],
                    [editField]: value,
                },
            }));
        }

        if (ticketKey) {
            const dropdownName = field;
            setDropdowns((prev) => ({
                ...prev,
                [dropdownName]: {
                    ...prev[dropdownName],
                    [ticketKey]: false,
                },
            }));
        } else {
            let dropdownNameToClose = "";
            if (field === "flight_route_id") {
                dropdownNameToClose = "flightCode";
            } else if (field === "ticket_class_name") {
                dropdownNameToClose = "ticketClass";
            }

            if (dropdownNameToClose) {
                setDropdowns((prev) => ({
                    ...prev,
                    [dropdownNameToClose]: false,
                }));
            }
        }
    };

    const addTicket = () => {
        if (
            newTicket.flight_route_id &&
            newTicket.ticket_class_name &&
            newTicket.price
        ) {
            const internalId = `internal_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const newTicketEntry = { ...newTicket, internalId };
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
        if (ticket.internalId) {
            // Xóa khỏi danh sách hiển thị chính
            setTicketClasses((prev) =>
                prev.filter((t) => t.internalId !== ticket.internalId),
            );

            setNewTicketClasses((prev) =>
                prev.filter((item) => item.internalId !== ticket.internalId),
            );
        }
    };

    const handleEditTicket = (ticket) => {
        const key =
            ticket.internalId ||
            `${ticket.flight_route_id}_${ticket.ticket_class_name}`;
        setEditingTicketClasses({
            ...editingTicketClasses,
            [key]: {
                flight_route_id: ticket.flight_route_id,
                ticket_class_name: ticket.ticket_class_name,
                price: ticket.price,
            },
        });

        setOriginalTicketValues({
            ...originalTicketValues,
            [key]: {
                flight_route_id: ticket.flight_route_id,
                ticket_class_name: ticket.ticket_class_name,
                price: ticket.price,
            },
        });
    };

    const handleSaveEditTicket = (ticket) => {
        const key =
            ticket.internalId ||
            `${ticket.flight_route_id}_${ticket.ticket_class_name}`;
        const editedData = editingTicketClasses[key];
        const original = originalTicketValues[key];

        const hasChanged =
            original?.flight_route_id !== editedData.flight_route_id ||
            original?.ticket_class_name !== editedData.ticket_class_name ||
            original?.price !== editedData.price;

        setTicketClasses((prev) =>
            prev.map((t) => {
                const tKey =
                    t.internalId ||
                    `${t.flight_route_id}_${t.ticket_class_name}`;
                if (tKey === key) {
                    return { ...t, ...editedData };
                }
                return t;
            }),
        );

        if (hasChanged) {
            setChangedTicketClasses({
                ...changedTicketClasses,
                [key]: {
                    original: original,
                    current: {
                        flight_route_id: editedData.flight_route_id,
                        ticket_class_name: editedData.ticket_class_name,
                        price: editedData.price,
                    },
                },
            });
        }

        if (!ticket.internalId) {
            const existingIndex = modifiedTicketClasses.findIndex(
                (t) =>
                    t.flight_route_id === ticket.flight_route_id &&
                    t.ticket_class_name === ticket.ticket_class_name,
            );
            if (existingIndex >= 0) {
                const updated = [...modifiedTicketClasses];
                updated[existingIndex] = { ...ticket, ...editedData };
                setModifiedTicketClasses(updated);
            } else {
                setModifiedTicketClasses([
                    ...modifiedTicketClasses,
                    { ...ticket, ...editedData },
                ]);
            }
        }

        const newEditingTicketClasses = { ...editingTicketClasses };
        delete newEditingTicketClasses[key];
        setEditingTicketClasses(newEditingTicketClasses);
    };

    const handleCancelEditTicket = (ticket) => {
        const key =
            ticket.internalId ||
            `${ticket.flight_route_id}_${ticket.ticket_class_name}`;
        const newEditingTicketClasses = { ...editingTicketClasses };
        delete newEditingTicketClasses[key];
        setEditingTicketClasses(newEditingTicketClasses);

        const newOriginalTicketValues = { ...originalTicketValues };
        delete newOriginalTicketValues[key];
        setOriginalTicketValues(newOriginalTicketValues);
    };

    const handleConfirm = async () => {
        const saveModifiedTicketClasses = async () => {
            for (const ticket of modifiedTicketClasses) {
                await axios.put(
                    `http://localhost:8000/api/v1/regulation/ticket_class_by_route/${ticket.flight_route_id}/${ticket.ticket_class_name}`,
                    {
                        price: ticket.price,
                    },
                );
            }
        };

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

            const modifiedTicketClassPromise = saveModifiedTicketClasses();

            const [updateRegulationRes] = await Promise.all([
                updateRulePromise,
                ticketClassPromise,
                modifiedTicketClassPromise,
            ]);

            setOriginalRegulations(updateRegulationRes.data);
            setRegulationData(updateRegulationRes.data);
            setModifiedFields({});
            setNewTicketClasses([]);
            setModifiedTicketClasses([]);
            setChangedTicketClasses({});

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
                        <div
                            className={`${styles.tableContainer} ${
                                Object.keys(editingTicketClasses).length > 0
                                    ? styles.editing
                                    : ""
                            }`}
                        >
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
                            {ticketClasses.map((ticket, index) => {
                                const key =
                                    ticket.internalId ||
                                    `${ticket.flight_route_id}_${ticket.ticket_class_name}`;
                                const isEditing = editingTicketClasses[key];
                                const isNewTicket = newTicketClasses.some(
                                    (item) =>
                                        item.internalId === ticket.internalId,
                                );
                                const hasChanged = changedTicketClasses[key];

                                return (
                                    <div
                                        key={index}
                                        className={`${styles.tableRow} ${
                                            isEditing ? styles.editingRow : ""
                                        } ${
                                            hasChanged ? styles.changedRow : ""
                                        }`}
                                    >
                                        <div className={styles.tableCell}>
                                            <div className={styles.cellContent}>
                                                {isEditing ? (
                                                    <div
                                                        className={
                                                            styles.dropdown
                                                        }
                                                        ref={(el) =>
                                                            (dropdownRefs.current[
                                                                `editFlightCode_${key}`
                                                            ] = el)
                                                        }
                                                        style={{
                                                            zIndex: dropdowns
                                                                .editFlightCode[
                                                                key
                                                            ]
                                                                ? 999999
                                                                : 1000,
                                                        }}
                                                    >
                                                        <button
                                                            className={`${styles.dropdownButtonSmall} ${
                                                                editingTicketClasses[
                                                                    key
                                                                ]
                                                                    ?.flight_route_id
                                                                    ? styles.airlineButton
                                                                    : ""
                                                            } ${styles.editingInput}`}
                                                            onClick={() =>
                                                                toggleDropdown(
                                                                    "editFlightCode",
                                                                    key,
                                                                )
                                                            }
                                                        >
                                                            {editingTicketClasses[
                                                                key
                                                            ]
                                                                ?.flight_route_id ||
                                                                "Mã tuyến bay"}
                                                            <ChevronDown
                                                                size={20}
                                                                className={
                                                                    styles.inputIcon
                                                                }
                                                            />
                                                        </button>
                                                        {dropdowns
                                                            .editFlightCode[
                                                            key
                                                        ] && (
                                                            <div
                                                                className={
                                                                    styles.dropdownMenu
                                                                }
                                                            >
                                                                {flightRouteOptions.map(
                                                                    (
                                                                        option,
                                                                        idx,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className={`${styles.dropdownItem} ${
                                                                                editingTicketClasses[
                                                                                    key
                                                                                ]
                                                                                    ?.flight_route_id ===
                                                                                option
                                                                                    ? styles.selected
                                                                                    : ""
                                                                            }`}
                                                                            onClick={() =>
                                                                                selectOption(
                                                                                    "editFlightCode",
                                                                                    option,
                                                                                    key,
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>
                                                            {
                                                                ticket.flight_route_id
                                                            }
                                                        </span>
                                                        {hasChanged &&
                                                            hasChanged.original
                                                                .flight_route_id !==
                                                                ticket.flight_route_id && (
                                                                <div
                                                                    className={
                                                                        styles.oldValue
                                                                    }
                                                                >
                                                                    Cũ:{" "}
                                                                    {
                                                                        hasChanged
                                                                            .original
                                                                            .flight_route_id
                                                                    }
                                                                </div>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.tableCell}>
                                            <div className={styles.cellContent}>
                                                {isEditing ? (
                                                    <div
                                                        className={
                                                            styles.dropdown
                                                        }
                                                        ref={(el) =>
                                                            (dropdownRefs.current[
                                                                `editTicketClass_${key}`
                                                            ] = el)
                                                        }
                                                        style={{
                                                            zIndex: dropdowns
                                                                .editTicketClass[
                                                                key
                                                            ]
                                                                ? 999999
                                                                : 1000,
                                                        }}
                                                    >
                                                        <button
                                                            className={`${styles.dropdownButtonSmall} ${
                                                                editingTicketClasses[
                                                                    key
                                                                ]
                                                                    ?.ticket_class_name
                                                                    ? styles.airlineButton
                                                                    : ""
                                                            } ${styles.editingInput}`}
                                                            onClick={() =>
                                                                toggleDropdown(
                                                                    "editTicketClass",
                                                                    key,
                                                                )
                                                            }
                                                        >
                                                            {editingTicketClasses[
                                                                key
                                                            ]
                                                                ?.ticket_class_name ||
                                                                "Hạng vé"}
                                                            <ChevronDown
                                                                size={20}
                                                                className={
                                                                    styles.inputIcon
                                                                }
                                                            />
                                                        </button>
                                                        {dropdowns
                                                            .editTicketClass[
                                                            key
                                                        ] && (
                                                            <div
                                                                className={
                                                                    styles.dropdownMenu
                                                                }
                                                            >
                                                                {ticketClassOptions.map(
                                                                    (
                                                                        option,
                                                                        idx,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className={`${styles.dropdownItem} ${
                                                                                editingTicketClasses[
                                                                                    key
                                                                                ]
                                                                                    ?.ticket_class_name ===
                                                                                option
                                                                                    ? styles.selected
                                                                                    : ""
                                                                            }`}
                                                                            onClick={() =>
                                                                                selectOption(
                                                                                    "editTicketClass",
                                                                                    option,
                                                                                    key,
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>
                                                            {
                                                                ticket.ticket_class_name
                                                            }
                                                        </span>
                                                        {hasChanged &&
                                                            hasChanged.original
                                                                .ticket_class_name !==
                                                                ticket.ticket_class_name && (
                                                                <div
                                                                    className={
                                                                        styles.oldValue
                                                                    }
                                                                >
                                                                    Cũ:{" "}
                                                                    {
                                                                        hasChanged
                                                                            .original
                                                                            .ticket_class_name
                                                                    }
                                                                </div>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.tableCell}>
                                            <div className={styles.cellContent}>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        className={`${styles.quantityInput} ${styles.editingInput}`}
                                                        value={
                                                            editingTicketClasses[
                                                                key
                                                            ]?.price || ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditingTicketClasses(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [key]: {
                                                                        ...prev[
                                                                            key
                                                                        ],
                                                                        price: e
                                                                            .target
                                                                            .value,
                                                                    },
                                                                }),
                                                            )
                                                        }
                                                        placeholder="Đơn giá"
                                                    />
                                                ) : (
                                                    <>
                                                        <span>
                                                            {parseInt(
                                                                ticket.price,
                                                            ).toLocaleString(
                                                                "vi-VN",
                                                            )}
                                                        </span>
                                                        {hasChanged &&
                                                            hasChanged.original
                                                                .price !==
                                                                ticket.price && (
                                                                <div
                                                                    className={
                                                                        styles.oldValue
                                                                    }
                                                                >
                                                                    Cũ:{" "}
                                                                    {parseInt(
                                                                        hasChanged
                                                                            .original
                                                                            .price,
                                                                    ).toLocaleString(
                                                                        "vi-VN",
                                                                    )}
                                                                </div>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.tableCell}>
                                            <div
                                                className={
                                                    styles.actionButtonGroup
                                                }
                                            >
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            className={
                                                                styles.saveButton
                                                            }
                                                            onClick={() =>
                                                                handleSaveEditTicket(
                                                                    ticket,
                                                                )
                                                            }
                                                        >
                                                            <Save size={14} />
                                                        </button>
                                                        <button
                                                            className={
                                                                styles.cancelEditButton
                                                            }
                                                            onClick={() =>
                                                                handleCancelEditTicket(
                                                                    ticket,
                                                                )
                                                            }
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className={
                                                                styles.editButton
                                                            }
                                                            onClick={() =>
                                                                handleEditTicket(
                                                                    ticket,
                                                                )
                                                            }
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        {isNewTicket && (
                                                            <button
                                                                className={
                                                                    styles.deleteButton
                                                                }
                                                                onClick={() =>
                                                                    removeTicket(
                                                                        index,
                                                                        ticket,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

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
                                            zIndex: dropdowns.flightCode
                                                ? 999999
                                                : 999998,
                                        }}
                                    >
                                        <button
                                            className={`${styles.dropdownButton} ${
                                                newTicket.flight_route_id
                                                    ? styles.airlineButton
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                toggleDropdown("flightCode")
                                            }
                                        >
                                            {newTicket.flight_route_id || "..."}
                                            {newTicket.flight_route_id ? (
                                                <X
                                                    size={20}
                                                    onClick={(e) =>
                                                        clearSelection(
                                                            "flight_route_id",
                                                            e,
                                                            "flightCode",
                                                        )
                                                    }
                                                    className={styles.clearIcon}
                                                />
                                            ) : (
                                                <ChevronDown
                                                    size={20}
                                                    className={styles.inputIcon}
                                                />
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
                                                            className={`${styles.dropdownItem} ${
                                                                newTicket.flight_route_id ===
                                                                option
                                                                    ? styles.selected
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                selectOption(
                                                                    "flight_route_id",
                                                                    option,
                                                                )
                                                            }
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
                                            zIndex: dropdowns.ticketClass
                                                ? 999999
                                                : 999998,
                                        }}
                                    >
                                        <button
                                            className={`${styles.dropdownButton} ${
                                                newTicket.ticket_class_name
                                                    ? styles.airlineButton
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                toggleDropdown("ticketClass")
                                            }
                                        >
                                            {newTicket.ticket_class_name ||
                                                "..."}
                                            {newTicket.ticket_class_name ? (
                                                <X
                                                    size={20}
                                                    onClick={(e) =>
                                                        clearSelection(
                                                            "ticket_class_name",
                                                            e,
                                                            "ticketClass",
                                                        )
                                                    }
                                                    className={styles.clearIcon}
                                                />
                                            ) : (
                                                <ChevronDown
                                                    size={20}
                                                    className={styles.inputIcon}
                                                />
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
                                                            className={`${styles.dropdownItem} ${
                                                                newTicket.ticket_class_name ===
                                                                option
                                                                    ? styles.selected
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                selectOption(
                                                                    "ticket_class_name",
                                                                    option,
                                                                )
                                                            }
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
                                        placeholder="Nhập giá vé"
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
