import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./RegulationForm.module.css";
import {
    ChevronDown,
    RotateCcw,
    Save,
    X,
    Trash2,
    Edit,
    Plus,
} from "react-feather";

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
                const serverTickets = ticketClassRouteRes.data.map(
                    (ticket) => ({
                        ...ticket,
                    }),
                );
                setTicketClasses(serverTickets);

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
                    "Error fetching data:",
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

        if (String(value) !== String(originalRegulations[field])) {
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

    const toggleDropdown = (dropdownName, itemKey = null) => {
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

            if (itemKey) {
                isCurrentlyOpen = prev[dropdownName]?.[itemKey] || false;
                if (!isCurrentlyOpen) {
                    if (!nextState[dropdownName]) nextState[dropdownName] = {};
                    nextState[dropdownName][itemKey] = true;
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
        itemKeyIfEdit = null,
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
                [itemKeyIfEdit]: {
                    ...prev[itemKeyIfEdit],
                    [editField]: "",
                },
            }));
            if (itemKeyIfEdit) {
                setDropdowns((prev) => ({
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [itemKeyIfEdit]: false,
                    },
                }));
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            let shouldUpdateState = false;
            const newDropdownStates = JSON.parse(JSON.stringify(dropdowns));

            Object.keys(dropdownRefs.current).forEach((refKey) => {
                if (
                    dropdownRefs.current[refKey] &&
                    !dropdownRefs.current[refKey].contains(event.target)
                ) {
                    if (
                        refKey === "flightCode" &&
                        newDropdownStates.flightCode
                    ) {
                        newDropdownStates.flightCode = false;
                        shouldUpdateState = true;
                    } else if (
                        refKey === "ticketClass" &&
                        newDropdownStates.ticketClass
                    ) {
                        newDropdownStates.ticketClass = false;
                        shouldUpdateState = true;
                    } else if (refKey.startsWith("editFlightCode_")) {
                        const ticketId = refKey.substring(
                            "editFlightCode_".length,
                        );
                        if (
                            newDropdownStates.editFlightCode &&
                            newDropdownStates.editFlightCode[ticketId]
                        ) {
                            newDropdownStates.editFlightCode[ticketId] = false;
                            shouldUpdateState = true;
                        }
                    } else if (refKey.startsWith("editTicketClass_")) {
                        const ticketId = refKey.substring(
                            "editTicketClass_".length,
                        );
                        if (
                            newDropdownStates.editTicketClass &&
                            newDropdownStates.editTicketClass[ticketId]
                        ) {
                            newDropdownStates.editTicketClass[ticketId] = false;
                            shouldUpdateState = true;
                        }
                    }
                }
            });
            if (shouldUpdateState) {
                setDropdowns(newDropdownStates);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdowns]);

    const handleNewTicketChange = (field, value) => {
        setNewTicket((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const selectOption = (field, value, itemKey = null) => {
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
                [itemKey]: {
                    ...prev[itemKey],
                    [editField]: value,
                },
            }));
        }

        if (itemKey) {
            const dropdownName = field;
            setDropdowns((prev) => ({
                ...prev,
                [dropdownName]: {
                    ...prev[dropdownName],
                    [itemKey]: false,
                },
            }));
        } else {
            let dropdownNameToClose = "";
            if (field === "flight_route_id") dropdownNameToClose = "flightCode";
            else if (field === "ticket_class_name")
                dropdownNameToClose = "ticketClass";

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
            const temp_id = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const newTicketEntry = {
                ...newTicket,
                temp_id,
                price: parseFloat(newTicket.price),
            };

            setTicketClasses((prev) => [...prev, newTicketEntry]);
            setNewTicketClasses((prev) => [...prev, newTicketEntry]);

            setNewTicket({
                flight_route_id: "",
                ticket_class_name: "",
                price: "",
            });
        }
    };

    const removeTicket = (ticketToRemove) => {
        if (ticketToRemove.temp_id && !ticketToRemove.ticket_price_id) {
            setTicketClasses((prev) =>
                prev.filter(
                    (t) =>
                        (t.temp_id || t.ticket_price_id) !==
                        (ticketToRemove.temp_id ||
                            ticketToRemove.ticket_price_id),
                ),
            );
            setNewTicketClasses((prev) =>
                prev.filter((item) => item.temp_id !== ticketToRemove.temp_id),
            );
            setChangedTicketClasses((prev) => {
                const updated = { ...prev };
                delete updated[ticketToRemove.temp_id];
                return updated;
            });
        }
    };

    const handleEditTicket = (ticket) => {
        const key = ticket.ticket_price_id || ticket.temp_id;
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
        const key = ticket.ticket_price_id || ticket.temp_id;
        const editedData = editingTicketClasses[key];
        const originalData = originalTicketValues[key];

        if (!editedData || !originalData) {
            console.error("Missing data for key:", key);
            return;
        }

        const currentPrice = parseFloat(editedData.price);
        const originalPrice = parseFloat(originalData.price);

        const hasChanged =
            String(originalData.flight_route_id) !==
                String(editedData.flight_route_id) ||
            String(originalData.ticket_class_name) !==
                String(editedData.ticket_class_name) ||
            originalPrice !== currentPrice;

        setTicketClasses((prev) =>
            prev.map((t) => {
                const currentItemKey = t.ticket_price_id || t.temp_id;
                if (currentItemKey === key) {
                    return { ...t, ...editedData, price: currentPrice };
                }
                return t;
            }),
        );

        if (hasChanged) {
            setChangedTicketClasses((prev) => ({
                ...prev,
                [key]: {
                    original: originalData,
                    current: { ...editedData, price: currentPrice },
                },
            }));
        } else {
            setChangedTicketClasses((prev) => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
        }

        if (ticket.ticket_price_id) {
            if (hasChanged) {
                const itemToModify = {
                    ticket_price_id: ticket.ticket_price_id,
                    flight_route_id: editedData.flight_route_id,
                    ticket_class_name: editedData.ticket_class_name,
                    price: currentPrice,
                };
                setModifiedTicketClasses((prevModified) => {
                    const existingIndex = prevModified.findIndex(
                        (t) => t.ticket_price_id === ticket.ticket_price_id,
                    );
                    if (existingIndex >= 0) {
                        const updated = [...prevModified];
                        updated[existingIndex] = itemToModify;
                        return updated;
                    } else {
                        return [...prevModified, itemToModify];
                    }
                });
            } else {
                setModifiedTicketClasses((prevModified) =>
                    prevModified.filter(
                        (t) => t.ticket_price_id !== ticket.ticket_price_id,
                    ),
                );
            }
        } else if (ticket.temp_id) {
            if (hasChanged) {
                setNewTicketClasses((prevNew) =>
                    prevNew.map((nt) =>
                        nt.temp_id === ticket.temp_id
                            ? { ...nt, ...editedData, price: currentPrice }
                            : nt,
                    ),
                );
            }
        }

        const newEditingTicketClasses = { ...editingTicketClasses };
        delete newEditingTicketClasses[key];
        setEditingTicketClasses(newEditingTicketClasses);
    };

    const handleCancelEditTicket = (ticket) => {
        const key = ticket.ticket_price_id || ticket.temp_id;
        const newEditingTicketClasses = { ...editingTicketClasses };
        delete newEditingTicketClasses[key];
        setEditingTicketClasses(newEditingTicketClasses);

        const originalData = originalTicketValues[key];
        if (originalData) {
            setTicketClasses((prev) =>
                prev.map((t) => {
                    const currentItemKey = t.ticket_price_id || t.temp_id;
                    if (currentItemKey === key) {
                        return { ...t, ...originalData };
                    }
                    return t;
                }),
            );
            setChangedTicketClasses((prev) => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
        }
    };

    const handleConfirm = async () => {
        const updateRules = async () => {
            const response = await axios.put(
                "http://localhost:8000/api/v1/regulation/update_rule",
                regulationData,
            );
            setOriginalRegulations(response.data);
            setRegulationData(response.data);
        };

        const saveNewTicketClasses = async () => {
            for (const ticket_class of newTicketClasses) {
                const { temp_id, ...payload } = ticket_class;
                await axios.post(
                    "http://localhost:8000/api/v1/regulation/create_ticket_class_by_route",
                    payload,
                );
            }
        };

        const saveModifiedTicketClasses = async () => {
            for (const ticket of modifiedTicketClasses) {
                await axios.put(
                    `http://localhost:8000/api/v1/regulation/update_ticket_class_by_route`,
                    {
                        ticket_price_id: ticket.ticket_price_id,
                        flight_route_id: ticket.flight_route_id,
                        ticket_class_name: ticket.ticket_class_name,
                        price: ticket.price,
                    },
                );
            }
        };

        setLoading(true);
        try {
            const promises = [];
            if (Object.keys(modifiedFields).length > 0) {
                promises.push(updateRules());
            }
            if (newTicketClasses.length > 0) {
                promises.push(saveNewTicketClasses());
            }
            if (modifiedTicketClasses.length > 0) {
                promises.push(saveModifiedTicketClasses());
            }

            if (promises.length > 0) {
                await Promise.all(promises);
            }

            setModifiedFields({});
            setNewTicketClasses([]);
            setModifiedTicketClasses([]);
            setChangedTicketClasses({});
            setEditingTicketClasses({});
            setOriginalTicketValues({});

            setToast({
                show: true,
                type: "success",
                message: "Cập nhật quy định thành công!",
            });
        } catch (error) {
            setToast({
                show: true,
                type: "error",
                message: "Cập nhật quy định không thành công!",
            });
            console.error(
                "Error updating:",
                error.response?.data || error.message,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
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
                            <label>Số SÂN BAY TRUNG GIAN TỐI ĐA</label>
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
                            <label>THỜI GIAN DỪA TỐI THIỂU (PHÚT)</label>
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
                            <label>THỜI GIAN DỪA TỐI ĐA (PHÚT)</label>
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

            <div className={styles.section}>
                <div
                    className={styles.sectionHeader}
                    onClick={() => setTicketRulesOpen(!ticketRulesOpen)}
                >
                    <span>THAY ĐỔI QUY ĐỊNH HẠNG VÉ</span>
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
                                    Xem chi tiết hạng vé
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

                            {ticketClasses.map((ticket) => {
                                const itemKey =
                                    ticket.ticket_price_id || ticket.temp_id;
                                const isEditing =
                                    !!editingTicketClasses[itemKey];
                                const isNewTicket =
                                    !!ticket.temp_id &&
                                    !ticket.ticket_price_id &&
                                    newTicketClasses.some(
                                        (nt) => nt.temp_id === ticket.temp_id,
                                    );
                                const hasChanged =
                                    changedTicketClasses[itemKey];

                                return (
                                    <div
                                        key={itemKey}
                                        className={`${styles.tableRow} ${
                                            isEditing ? styles.editingRow : ""
                                        } ${hasChanged ? styles.changedRow : ""}`}
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
                                                                `editFlightCode_${itemKey}`
                                                            ] = el)
                                                        }
                                                        style={{
                                                            zIndex: dropdowns
                                                                .editFlightCode[
                                                                itemKey
                                                            ]
                                                                ? 999999
                                                                : 1000,
                                                        }}
                                                    >
                                                        <button
                                                            className={`${styles.dropdownButtonSmall} ${
                                                                editingTicketClasses[
                                                                    itemKey
                                                                ]
                                                                    ?.flight_route_id
                                                                    ? styles.airlineButton
                                                                    : ""
                                                            } ${styles.editingInput}`}
                                                            onClick={() =>
                                                                toggleDropdown(
                                                                    "editFlightCode",
                                                                    itemKey,
                                                                )
                                                            }
                                                        >
                                                            {editingTicketClasses[
                                                                itemKey
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
                                                            itemKey
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
                                                                                    itemKey
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
                                                                                    itemKey,
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
                                                            String(
                                                                hasChanged
                                                                    .original
                                                                    .flight_route_id,
                                                            ) !==
                                                                String(
                                                                    ticket.flight_route_id,
                                                                ) && (
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
                                                                `editTicketClass_${itemKey}`
                                                            ] = el)
                                                        }
                                                        style={{
                                                            zIndex: dropdowns
                                                                .editTicketClass[
                                                                itemKey
                                                            ]
                                                                ? 999999
                                                                : 1000,
                                                        }}
                                                    >
                                                        <button
                                                            className={`${styles.dropdownButtonSmall} ${
                                                                editingTicketClasses[
                                                                    itemKey
                                                                ]
                                                                    ?.ticket_class_name
                                                                    ? styles.airlineButton
                                                                    : ""
                                                            } ${styles.editingInput}`}
                                                            onClick={() =>
                                                                toggleDropdown(
                                                                    "editTicketClass",
                                                                    itemKey,
                                                                )
                                                            }
                                                        >
                                                            {editingTicketClasses[
                                                                itemKey
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
                                                            itemKey
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
                                                                                    itemKey
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
                                                                                    itemKey,
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
                                                            String(
                                                                hasChanged
                                                                    .original
                                                                    .ticket_class_name,
                                                            ) !==
                                                                String(
                                                                    ticket.ticket_class_name,
                                                                ) && (
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
                                                                itemKey
                                                            ]?.price || ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditingTicketClasses(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [itemKey]: {
                                                                        ...prev[
                                                                            itemKey
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
                                                            {ticket.price !=
                                                            null
                                                                ? parseFloat(
                                                                      ticket.price,
                                                                  ).toLocaleString(
                                                                      "vi-VN",
                                                                  )
                                                                : ""}
                                                        </span>
                                                        {hasChanged &&
                                                            parseFloat(
                                                                hasChanged
                                                                    .original
                                                                    .price,
                                                            ) !==
                                                                parseFloat(
                                                                    ticket.price,
                                                                ) && (
                                                                <div
                                                                    className={
                                                                        styles.oldValue
                                                                    }
                                                                >
                                                                    Cũ:{" "}
                                                                    {parseFloat(
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
                                                    <button
                                                        className={
                                                            isNewTicket
                                                                ? styles.deleteButton
                                                                : styles.editButton
                                                        }
                                                        onClick={() =>
                                                            isNewTicket
                                                                ? removeTicket(
                                                                      ticket,
                                                                  )
                                                                : handleEditTicket(
                                                                      ticket,
                                                                  )
                                                        }
                                                        disabled={
                                                            Object.keys(
                                                                editingTicketClasses,
                                                            ).length > 0 &&
                                                            !editingTicketClasses[
                                                                itemKey
                                                            ]
                                                        }
                                                    >
                                                        {isNewTicket ? (
                                                            <Trash2 size={14} />
                                                        ) : (
                                                            <Edit size={14} />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

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
                                        <Plus size={16} /> Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.actionButtons}>
                <button
                    className={styles.cancelBtn}
                    onClick={() => {
                        setRegulationData({ ...originalRegulations });
                        setModifiedFields({});
                        axios
                            .get(
                                "http://localhost:8000/api/v1/regulation/ticket_class_by_route",
                            )
                            .then((res) => setTicketClasses(res.data))
                            .catch((err) =>
                                console.error(
                                    "Error fetching ticket classes on cancel:",
                                    err,
                                ),
                            );
                        setNewTicketClasses([]);
                        setModifiedTicketClasses([]);
                        setChangedTicketClasses({});
                        setEditingTicketClasses({});
                        setOriginalTicketValues({});
                    }}
                >
                    Hủy
                </button>
                <button className={styles.confirmBtn} onClick={handleConfirm}>
                    Xác nhận
                </button>
            </div>
        </div>
    );
}
