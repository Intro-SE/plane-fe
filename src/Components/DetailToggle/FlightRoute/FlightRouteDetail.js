import { useState, useEffect, useRef } from "react";
import styles from "./FlightRouteDetail.module.css";
import { Plus, Trash2, ChevronDown, X, Edit, Save } from "lucide-react";
import axios from "axios";

export default function FlightRouteDetail({ setToast, onClose, setLoading }) {
    const [flightRoutes, setFlightRoutes] = useState([]);
    const [newFlightRoutes, setNewFlightRoutes] = useState([]);
    const [intermediateAirports, setIntermediateAirports] = useState([]);
    const [newIntermediateAirports, setNewIntermediateAirports] = useState([]);
    const [deletedIntermediateAirports, setDeletedIntermediateAirports] =
        useState([]);
    const [airports, setAirports] = useState([]);
    const [editingFlightRoutes, setEditingFlightRoutes] = useState({});
    const [modifiedFlightRoutes, setModifiedFlightRoutes] = useState([]);
    const [originalValues, setOriginalValues] = useState({});
    const [changedFlightRoutes, setChangedFlightRoutes] = useState({});
    const [editingIntermediateAirports, setEditingIntermediateAirports] =
        useState({});
    const [modifiedIntermediateAirports, setModifiedIntermediateAirports] =
        useState([]);
    const [originalIntermediateValues, setOriginalIntermediateValues] =
        useState({});
    const [changedIntermediateAirports, setChangedIntermediateAirports] =
        useState({});
    const [dropdowns, setDropdowns] = useState({
        departureAirport: false,
        arrivalAirport: false,
        transitAirport: false,
        routeCode: false,
        editDepartureAirport: {},
        editArrivalAirport: {},
        editIntermediateRouteCode: {},
        editIntermediateTransitAirport: {},
    });

    const dropdownRefs = useRef({});
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [flightRoutesRes, intermediateAirportsRes, airportsRes] =
                    await Promise.all([
                        axios.get(
                            "http://localhost:8000/api/v1/flightroutes_crud",
                        ),
                        axios.get(
                            "http://localhost:8000/api/v1/regulation/flight_detail",
                        ),
                        axios.get("http://localhost:8000/api/v1/airports_crud"),
                    ]);

                const routes = flightRoutesRes.data.map((route) => ({
                    code: route.flight_route_id,
                    departureAirport: route.departure_airport.airport_name,
                    arrivalAirport: route.arrival_airport.airport_name,
                    departureAirportID: route.departure_airport.airport_id,
                    arrivalAirportID: route.arrival_airport.airport_id,
                }));

                setFlightRoutes(routes);
                setIntermediateAirports(intermediateAirportsRes.data);
                setAirports(airportsRes.data || []);
            } catch (error) {
                console.log(
                    "Lỗi khi lấy dữ liệu:",
                    error.response?.data || error.message,
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [setLoading]);

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

    const [newFlightRoute, setNewFlightRoute] = useState({
        code: "",
        departureAirport: "",
        arrivalAirport: "",
        departureAirportID: "",
        arrivalAirportID: "",
    });

    const [newIntermediateAirport, setNewIntermediateAirport] = useState({
        flight_route_id: "",
        transit_airport_name: "",
        stop_time: "",
        note: "",
    });

    const handleDeleteRoute = (internalId) => {
        setNewFlightRoutes(
            newFlightRoutes.filter((route) => route.internalId !== internalId),
        );
        setFlightRoutes(
            flightRoutes.filter((route) => route.internalId !== internalId),
        );
        const newEditingFlightRoutes = { ...editingFlightRoutes };
        delete newEditingFlightRoutes[internalId];
        setEditingFlightRoutes(newEditingFlightRoutes);
    };

    const handleAddRoute = () => {
        if (newFlightRoute.departureAirport && newFlightRoute.arrivalAirport) {
            const internalId = `internal_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const newRouteEntry = {
                ...newFlightRoute,
                code: "TBxx",
                internalId: internalId,
            };
            setFlightRoutes((prev) => [...prev, newRouteEntry]);
            setNewFlightRoutes((prev) => [...prev, newRouteEntry]);
            setNewFlightRoute({
                code: "",
                departureAirport: "",
                arrivalAirport: "",
                departureAirportID: "",
                arrivalAirportID: "",
                internalId: "",
            });
        }
    };

    const handleNewRouteChange = (field, value) => {
        setNewFlightRoute({
            ...newFlightRoute,
            [field]: value,
        });
    };

    const toggleDropdown = (dropdown, routeKey = null) => {
        if (dropdown.startsWith("edit") && routeKey) {
            setDropdowns((prev) => ({
                ...prev,
                [dropdown]: {
                    ...prev[dropdown],
                    [routeKey]: !prev[dropdown][routeKey],
                },
            }));
        } else {
            setDropdowns((prev) => ({
                ...prev,
                [dropdown]: !prev[dropdown],
            }));
        }
    };

    const selectOption = (field, value, routeKey = null) => {
        if (field === "departureAirport" || field === "arrivalAirport") {
            const { name, id } = value;
            setNewFlightRoute((prev) => ({
                ...prev,
                [field]: name,
                [field + "ID"]: id,
            }));
        } else if (
            field === "editDepartureAirport" ||
            field === "editArrivalAirport"
        ) {
            const { name, id } = value;
            const editField =
                field === "editDepartureAirport"
                    ? "departureAirport"
                    : "arrivalAirport";
            setEditingFlightRoutes((prev) => ({
                ...prev,
                [routeKey]: {
                    ...prev[routeKey],
                    [editField]: name,
                    [editField + "ID"]: id,
                },
            }));
        } else if (field === "transitAirport") {
            setNewIntermediateAirport((prev) => ({
                ...prev,
                transit_airport_name: value,
            }));
        } else if (field === "routeCode") {
            setNewIntermediateAirport((prev) => ({
                ...prev,
                flight_route_id: value,
            }));
        } else if (field === "editIntermediateRouteCode") {
            setEditingIntermediateAirports((prev) => ({
                ...prev,
                [routeKey]: {
                    ...prev[routeKey],
                    flight_route_id: value,
                },
            }));
        } else if (field === "editIntermediateTransitAirport") {
            setEditingIntermediateAirports((prev) => ({
                ...prev,
                [routeKey]: {
                    ...prev[routeKey],
                    transit_airport_name: value,
                },
            }));
        }

        if (field.startsWith("edit") && routeKey) {
            setDropdowns((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [routeKey]: false,
                },
            }));
        } else {
            setDropdowns((prev) => ({
                ...prev,
                [field]: false,
            }));
        }
    };

    const clearSelection = (field, event) => {
        event.stopPropagation();
        if (field === "departureAirport" || field === "arrivalAirport") {
            setNewFlightRoute((prev) => ({
                ...prev,
                [field]: "",
                [field + "ID"]: "",
            }));
        } else if (field === "transitAirport") {
            setNewIntermediateAirport((prev) => ({
                ...prev,
                transit_airport_name: "",
            }));
        } else if (field === "routeCode") {
            setNewIntermediateAirport((prev) => ({
                ...prev,
                flight_route_id: "",
            }));
        }
    };

    const handleDeleteIntermediate = (index, airport) => {
        const isNewItem = newIntermediateAirports.some(
            (item) =>
                item.flight_route_id === airport.flight_route_id &&
                item.transit_airport_name === airport.transit_airport_name &&
                item.stop_time === airport.stop_time,
        );

        if (isNewItem) {
            setNewIntermediateAirports(
                newIntermediateAirports.filter(
                    (item) =>
                        !(
                            item.flight_route_id === airport.flight_route_id &&
                            item.transit_airport_name ===
                                airport.transit_airport_name &&
                            item.stop_time === airport.stop_time
                        ),
                ),
            );
        } else {
            setDeletedIntermediateAirports((prev) => [
                ...prev,
                { ...airport, originalIndex: index },
            ]);
        }

        setIntermediateAirports(
            intermediateAirports.filter((_, i) => i !== index),
        );
    };

    const handleAddIntermediate = () => {
        if (
            newIntermediateAirport.flight_route_id &&
            newIntermediateAirport.transit_airport_name &&
            newIntermediateAirport.stop_time
        ) {
            const newIntermediateEntry = { ...newIntermediateAirport };
            setIntermediateAirports([
                ...intermediateAirports,
                newIntermediateEntry,
            ]);
            setNewIntermediateAirports([
                ...newIntermediateAirports,
                newIntermediateEntry,
            ]);
            setNewIntermediateAirport({
                flight_route_id: "",
                transit_airport_name: "",
                stop_time: "",
                note: "",
            });
        }
    };

    const handleNewIntermediateChange = (field, value) => {
        setNewIntermediateAirport({
            ...newIntermediateAirport,
            [field]: value,
        });
    };

    const handleEditIntermediate = (airport, index) => {
        const key = `intermediate_${index}`;
        setEditingIntermediateAirports({
            ...editingIntermediateAirports,
            [key]: {
                flight_route_id: airport.flight_route_id,
                transit_airport_name: airport.transit_airport_name,
                stop_time: airport.stop_time,
                note: airport.note,
            },
        });

        setOriginalIntermediateValues({
            ...originalIntermediateValues,
            [key]: {
                flight_route_id: airport.flight_route_id,
                transit_airport_name: airport.transit_airport_name,
                stop_time: airport.stop_time,
                note: airport.note,
            },
        });
    };

    const handleSaveEditIntermediate = (airport, index) => {
        const key = `intermediate_${index}`;
        const editedData = editingIntermediateAirports[key];
        const original = originalIntermediateValues[key];

        const hasChanged =
            original?.flight_route_id !== editedData.flight_route_id ||
            original?.transit_airport_name !==
                editedData.transit_airport_name ||
            original?.stop_time !== editedData.stop_time ||
            original?.note !== editedData.note;

        setIntermediateAirports(
            intermediateAirports.map((item, i) => {
                if (i === index) {
                    return { ...item, ...editedData };
                }
                return item;
            }),
        );

        if (hasChanged) {
            setChangedIntermediateAirports({
                ...changedIntermediateAirports,
                [key]: {
                    original: original,
                    current: editedData,
                },
            });
        }

        if (
            !newIntermediateAirports.some(
                (item) =>
                    item.flight_route_id === airport.flight_route_id &&
                    item.transit_airport_name ===
                        airport.transit_airport_name &&
                    item.stop_time === airport.stop_time,
            )
        ) {
            const existingIndex = modifiedIntermediateAirports.findIndex(
                (item, i) => i === index,
            );
            if (existingIndex >= 0) {
                const updated = [...modifiedIntermediateAirports];
                updated[existingIndex] = { ...airport, ...editedData };
                setModifiedIntermediateAirports(updated);
            } else {
                setModifiedIntermediateAirports([
                    ...modifiedIntermediateAirports,
                    { ...airport, ...editedData, originalIndex: index },
                ]);
            }
        }

        const newEditingIntermediateAirports = {
            ...editingIntermediateAirports,
        };
        delete newEditingIntermediateAirports[key];
        setEditingIntermediateAirports(newEditingIntermediateAirports);
    };

    const handleCancelEditIntermediate = (airport, index) => {
        const key = `intermediate_${index}`;
        const newEditingIntermediateAirports = {
            ...editingIntermediateAirports,
        };
        delete newEditingIntermediateAirports[key];
        setEditingIntermediateAirports(newEditingIntermediateAirports);

        const newOriginalIntermediateValues = { ...originalIntermediateValues };
        delete newOriginalIntermediateValues[key];
        setOriginalIntermediateValues(newOriginalIntermediateValues);
    };

    const handleCancel = () => {
        onClose();
    };

    const handleEdit = (route) => {
        const key = route.internalId || route.code;
        setEditingFlightRoutes({
            ...editingFlightRoutes,
            [key]: {
                departureAirport: route.departureAirport,
                arrivalAirport: route.arrivalAirport,
                departureAirportID: route.departureAirportID,
                arrivalAirportID: route.arrivalAirportID,
                code: route.code,
            },
        });

        setOriginalValues({
            ...originalValues,
            [key]: {
                departureAirport: route.departureAirport,
                arrivalAirport: route.arrivalAirport,
            },
        });
    };

    const handleSaveEdit = (route) => {
        const key = route.internalId || route.code;
        const editedData = editingFlightRoutes[key];
        const original = originalValues[key];

        const hasChanged =
            original?.departureAirport !== editedData.departureAirport ||
            original?.arrivalAirport !== editedData.arrivalAirport;

        setFlightRoutes(
            flightRoutes.map((r) => {
                const rKey = r.internalId || r.code;
                if (rKey === key) {
                    return { ...r, ...editedData };
                }
                return r;
            }),
        );

        if (hasChanged) {
            setChangedFlightRoutes({
                ...changedFlightRoutes,
                [key]: {
                    original: original,
                    current: {
                        departureAirport: editedData.departureAirport,
                        arrivalAirport: editedData.arrivalAirport,
                    },
                },
            });
        }

        if (!route.internalId) {
            const existingIndex = modifiedFlightRoutes.findIndex(
                (r) => r.code === route.code,
            );
            if (existingIndex >= 0) {
                const updated = [...modifiedFlightRoutes];
                updated[existingIndex] = { ...route, ...editedData };
                setModifiedFlightRoutes(updated);
            } else {
                setModifiedFlightRoutes([
                    ...modifiedFlightRoutes,
                    { ...route, ...editedData },
                ]);
            }
        }

        const newEditingFlightRoutes = { ...editingFlightRoutes };
        delete newEditingFlightRoutes[key];
        setEditingFlightRoutes(newEditingFlightRoutes);
    };

    const handleCancelEdit = (route) => {
        const key = route.internalId || route.code;
        const newEditingFlightRoutes = { ...editingFlightRoutes };
        delete newEditingFlightRoutes[key];
        setEditingFlightRoutes(newEditingFlightRoutes);

        const newOriginalValues = { ...originalValues };
        delete newOriginalValues[key];
        setOriginalValues(newOriginalValues);
    };

    const handleSave = async () => {
        const saveFlightRoutes = async () => {
            for (const flightRoute of newFlightRoutes) {
                await axios.post(
                    "http://localhost:8000/api/v1/flightroutes_crud",
                    {
                        departure_airport_id: flightRoute.departureAirportID,
                        arrival_airport_id: flightRoute.arrivalAirportID,
                    },
                );
            }
        };

        const saveModifiedFlightRoutes = async () => {
            for (const flightRoute of modifiedFlightRoutes) {
                await axios.put(
                    `http://localhost:8000/api/v1/flightroutes_crud?FlightRoute_id=${flightRoute.code}`,
                    {
                        departure_airport_id: flightRoute.departureAirportID,
                        arrival_airport_id: flightRoute.arrivalAirportID,
                    },
                );
            }
        };

        const saveIntermediateAirports = async () => {
            for (const intermediateAirport of newIntermediateAirports) {
                await axios.post(
                    "http://localhost:8000/api/v1/regulation/create_transit_airport",
                    {
                        flight_route_id: intermediateAirport.flight_route_id,
                        transit_airport_name:
                            intermediateAirport.transit_airport_name,
                        stop_time: intermediateAirport.stop_time,
                        note: intermediateAirport.note,
                    },
                );
            }
        };

        const saveModifiedIntermediateAirports = async () => {
            for (const intermediateAirport of modifiedIntermediateAirports) {
                await axios.put(
                    `http://localhost:8000/api/v1/regulation/update_transit`,
                    {
                        flight_detail_id: intermediateAirport.flight_detail_id,
                        flight_route_id: intermediateAirport.flight_route_id,
                        transit_airport_name:
                            intermediateAirport.transit_airport_name,
                        stop_time: intermediateAirport.stop_time,
                        note: intermediateAirport.note,
                    },
                );
            }
        };

        const deleteIntermediateAirports = async () => {
            for (const intermediateAirport of deletedIntermediateAirports) {
                if (intermediateAirport.flight_detail_id) {
                    await axios.delete(
                        `http://localhost:8000/api/v1/regulation/delete_transit_airport`,
                        {
                            data: {
                                flight_route_id:
                                    intermediateAirport.flight_route_id,
                                transit_airport_name:
                                    intermediateAirport.transit_airport_name,
                            },
                        },
                    );
                }
            }
        };

        try {
            await Promise.all([
                saveFlightRoutes(),
                saveModifiedFlightRoutes(),
                saveIntermediateAirports(),
                saveModifiedIntermediateAirports(),
                deleteIntermediateAirports(),
            ]);
            setToast({
                show: true,
                type: "success",
                message: "Cập nhật tuyến bay và sân bay trung gian thành công!",
            });
        } catch (error) {
            console.error(
                "Lỗi khi cập nhật dữ liệu:",
                error.response?.data || error.message,
            );
            setToast({
                show: true,
                type: "error",
                message: "Cập nhật dữ liệu không thành công!",
            });
        }

        onClose();
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.header}>Quản lý tuyến bay</h2>

                {/* Flight Routes Table */}
                <div
                    className={`${styles.tableContainer} ${styles.flightRoutesTable} ${
                        Object.keys(editingFlightRoutes).length > 0
                            ? styles.editing
                            : ""
                    }`}
                >
                    <div className={styles.tableHeader}>
                        <div className={styles.tableHeaderCell}>
                            <span>Mã tuyến bay</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Sân bay đi</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Sân bay đến</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Thao tác</span>
                        </div>
                    </div>

                    {flightRoutes.map((route, index) => {
                        const key = route.internalId || route.code;
                        const isEditing = editingFlightRoutes[key];
                        const isNewRoute = newFlightRoutes.some(
                            (item) => item.internalId === route.internalId,
                        );
                        const hasChanged = changedFlightRoutes[key];

                        return (
                            <div
                                key={index}
                                className={`${styles.tableRow} ${isEditing ? styles.editingRow : ""} ${
                                    hasChanged ? styles.changedRow : ""
                                }`}
                            >
                                <div className={styles.tableCell}>
                                    <div className={styles.cellContent}>
                                        {route.code}
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <div className={styles.cellContent}>
                                        {isEditing ? (
                                            <div
                                                className={styles.dropdown}
                                                ref={(el) =>
                                                    (dropdownRefs.current[
                                                        `editDepartureAirport_${key}`
                                                    ] = el)
                                                }
                                                style={{
                                                    zIndex: dropdowns
                                                        .editDepartureAirport[
                                                        key
                                                    ]
                                                        ? 999999
                                                        : 1000,
                                                }}
                                            >
                                                <button
                                                    className={`${styles.dropdownButtonSmall} ${
                                                        editingFlightRoutes[key]
                                                            ?.departureAirport
                                                            ? styles.airlineButton
                                                            : ""
                                                    } ${styles.editingInput}`}
                                                    onClick={() =>
                                                        toggleDropdown(
                                                            "editDepartureAirport",
                                                            key,
                                                        )
                                                    }
                                                >
                                                    {editingFlightRoutes[key]
                                                        ?.departureAirport ||
                                                        "Sân bay đi"}
                                                    <ChevronDown
                                                        size={20}
                                                        className={
                                                            styles.inputIcon
                                                        }
                                                    />
                                                </button>
                                                {dropdowns.editDepartureAirport[
                                                    key
                                                ] && (
                                                    <div
                                                        className={
                                                            styles.dropdownMenu
                                                        }
                                                    >
                                                        {airports.map(
                                                            (
                                                                airport,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className={`${styles.dropdownItem} ${
                                                                        editingFlightRoutes[
                                                                            key
                                                                        ]
                                                                            ?.departureAirport ===
                                                                        airport.airport_name
                                                                            ? styles.selected
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        selectOption(
                                                                            "editDepartureAirport",
                                                                            {
                                                                                name: airport.airport_name,
                                                                                id: airport.airport_id,
                                                                            },
                                                                            key,
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        airport.airport_name
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
                                                    {route.departureAirport}
                                                </span>
                                                {hasChanged &&
                                                    hasChanged.original
                                                        .departureAirport !==
                                                        route.departureAirport && (
                                                        <div
                                                            className={
                                                                styles.oldValue
                                                            }
                                                        >
                                                            Cũ:{" "}
                                                            {
                                                                hasChanged
                                                                    .original
                                                                    .departureAirport
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
                                                className={styles.dropdown}
                                                ref={(el) =>
                                                    (dropdownRefs.current[
                                                        `editArrivalAirport_${key}`
                                                    ] = el)
                                                }
                                                style={{
                                                    zIndex: dropdowns
                                                        .editArrivalAirport[key]
                                                        ? 999999
                                                        : 1000,
                                                }}
                                            >
                                                <button
                                                    className={`${styles.dropdownButtonSmall} ${
                                                        editingFlightRoutes[key]
                                                            ?.arrivalAirport
                                                            ? styles.airlineButton
                                                            : ""
                                                    } ${styles.editingInput}`}
                                                    onClick={() =>
                                                        toggleDropdown(
                                                            "editArrivalAirport",
                                                            key,
                                                        )
                                                    }
                                                >
                                                    {editingFlightRoutes[key]
                                                        ?.arrivalAirport ||
                                                        "Sân bay đến"}
                                                    <ChevronDown
                                                        size={20}
                                                        className={
                                                            styles.inputIcon
                                                        }
                                                    />
                                                </button>
                                                {dropdowns.editArrivalAirport[
                                                    key
                                                ] && (
                                                    <div
                                                        className={
                                                            styles.dropdownMenu
                                                        }
                                                    >
                                                        {airports.map(
                                                            (
                                                                airport,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className={`${styles.dropdownItem} ${
                                                                        editingFlightRoutes[
                                                                            key
                                                                        ]
                                                                            ?.arrivalAirport ===
                                                                        airport.airport_name
                                                                            ? styles.selected
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        selectOption(
                                                                            "editArrivalAirport",
                                                                            {
                                                                                name: airport.airport_name,
                                                                                id: airport.airport_id,
                                                                            },
                                                                            key,
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        airport.airport_name
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
                                                    {route.arrivalAirport}
                                                </span>
                                                {hasChanged &&
                                                    hasChanged.original
                                                        .arrivalAirport !==
                                                        route.arrivalAirport && (
                                                        <div
                                                            className={
                                                                styles.oldValue
                                                            }
                                                        >
                                                            Cũ:{" "}
                                                            {
                                                                hasChanged
                                                                    .original
                                                                    .arrivalAirport
                                                            }
                                                        </div>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <div className={styles.actionButtonGroup}>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    className={
                                                        styles.saveEditButton
                                                    }
                                                    onClick={() =>
                                                        handleSaveEdit(route)
                                                    }
                                                >
                                                    <Save size={14} />
                                                </button>
                                                <button
                                                    className={
                                                        styles.cancelEditButton
                                                    }
                                                    onClick={() =>
                                                        handleCancelEdit(route)
                                                    }
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className={
                                                        isNewRoute
                                                            ? styles.deleteButton
                                                            : styles.editButton
                                                    }
                                                    onClick={() =>
                                                        isNewRoute
                                                            ? handleDeleteRoute(
                                                                  route.internalId,
                                                              )
                                                            : handleEdit(route)
                                                    }
                                                >
                                                    {isNewRoute ? (
                                                        <Trash2 size={14} />
                                                    ) : (
                                                        <Edit size={14} />
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className={styles.tableRow}>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={`${styles.quantityInput} ${styles.disabledInput}`}
                                placeholder="Mã tự động sinh"
                                value={newFlightRoute.code}
                                onChange={(e) =>
                                    handleNewRouteChange("code", e.target.value)
                                }
                                disabled
                                title="Mã sân bay được tạo tự động"
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <div
                                className={styles.dropdown}
                                ref={(el) =>
                                    (dropdownRefs.current.departureAirport = el)
                                }
                                style={{
                                    zIndex: dropdowns.departureAirport
                                        ? 999999
                                        : 999998,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${
                                        newFlightRoute.departureAirport
                                            ? styles.airlineButton
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleDropdown("departureAirport")
                                    }
                                >
                                    {newFlightRoute.departureAirport ||
                                        "Sân bay đi"}
                                    {newFlightRoute.departureAirport ? (
                                        <X
                                            size={20}
                                            onClick={(e) =>
                                                clearSelection(
                                                    "departureAirport",
                                                    e,
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
                                {dropdowns.departureAirport && (
                                    <div className={styles.dropdownMenu}>
                                        {airports.map((airport, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.dropdownItem} ${
                                                    newFlightRoute.departureAirport ===
                                                    airport.airport_name
                                                        ? styles.selected
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    selectOption(
                                                        "departureAirport",
                                                        {
                                                            name: airport.airport_name,
                                                            id: airport.airport_id,
                                                        },
                                                    )
                                                }
                                            >
                                                {airport.airport_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.tableCell}>
                            <div
                                className={styles.dropdown}
                                ref={(el) =>
                                    (dropdownRefs.current.arrivalAirport = el)
                                }
                                style={{
                                    zIndex: dropdowns.arrivalAirport
                                        ? 999999
                                        : 999998,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${
                                        newFlightRoute.arrivalAirport
                                            ? styles.airlineButton
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleDropdown("arrivalAirport")
                                    }
                                >
                                    {newFlightRoute.arrivalAirport ||
                                        "Sân bay đến"}
                                    {newFlightRoute.arrivalAirport ? (
                                        <X
                                            size={20}
                                            onClick={(e) =>
                                                clearSelection(
                                                    "arrivalAirport",
                                                    e,
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
                                {dropdowns.arrivalAirport && (
                                    <div className={styles.dropdownMenu}>
                                        {airports.map((airport, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.dropdownItem} ${
                                                    newFlightRoute.arrivalAirport ===
                                                    airport.airport_name
                                                        ? styles.selected
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    selectOption(
                                                        "arrivalAirport",
                                                        {
                                                            name: airport.airport_name,
                                                            id: airport.airport_id,
                                                        },
                                                    )
                                                }
                                            >
                                                {airport.airport_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.tableCell}>
                            <button
                                className={styles.addButton}
                                onClick={handleAddRoute}
                            >
                                <Plus size={16} />
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>

                {/* Intermediate Airports Table */}
                <h2 className={styles.sectionHeader}>Sân bay trung gian</h2>
                <div
                    className={`${styles.tableContainer} ${styles.intermediateAirportsTable} ${
                        Object.keys(editingIntermediateAirports).length > 0
                            ? styles.editing
                            : ""
                    }`}
                >
                    <div className={styles.tableHeaderFive}>
                        <div className={styles.tableHeaderCell}>
                            <span>Mã tuyến bay</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Sân bay trung gian</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Thời gian dừng (phút)</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Ghi chú</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Thao tác</span>
                        </div>
                    </div>

                    {intermediateAirports.map((stop, index) => {
                        const key = `intermediate_${index}`;
                        const isEditing = editingIntermediateAirports[key];
                        const isNewItem = newIntermediateAirports.some(
                            (item) =>
                                item.flight_route_id === stop.flight_route_id &&
                                item.transit_airport_name ===
                                    stop.transit_airport_name &&
                                item.stop_time === stop.stop_time,
                        );
                        const hasChanged = changedIntermediateAirports[key];

                        return (
                            <div
                                key={index}
                                className={`${styles.tableRowFive} ${isEditing ? styles.editingRow : ""} ${
                                    hasChanged ? styles.changedRow : ""
                                }`}
                            >
                                <div className={styles.tableCell}>
                                    <div className={styles.cellContent}>
                                        {isEditing ? (
                                            <div
                                                className={styles.dropdown}
                                                ref={(el) =>
                                                    (dropdownRefs.current[
                                                        `editIntermediateRouteCode_${key}`
                                                    ] = el)
                                                }
                                                style={{
                                                    zIndex: dropdowns
                                                        .editIntermediateRouteCode[
                                                        key
                                                    ]
                                                        ? 999999
                                                        : 1000,
                                                }}
                                            >
                                                <button
                                                    className={`${styles.dropdownButtonSmall} ${
                                                        editingIntermediateAirports[
                                                            key
                                                        ]?.flight_route_id
                                                            ? styles.airlineButton
                                                            : ""
                                                    } ${styles.editingInput}`}
                                                    onClick={() =>
                                                        toggleDropdown(
                                                            "editIntermediateRouteCode",
                                                            key,
                                                        )
                                                    }
                                                >
                                                    {editingIntermediateAirports[
                                                        key
                                                    ]?.flight_route_id ||
                                                        "Mã tuyến bay"}
                                                    <ChevronDown
                                                        size={20}
                                                        className={
                                                            styles.inputIcon
                                                        }
                                                    />
                                                </button>
                                                {dropdowns
                                                    .editIntermediateRouteCode[
                                                    key
                                                ] && (
                                                    <div
                                                        className={
                                                            styles.dropdownMenu
                                                        }
                                                    >
                                                        {flightRoutes.map(
                                                            (
                                                                route,
                                                                routeIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        routeIndex
                                                                    }
                                                                    className={`${styles.dropdownItem} ${
                                                                        editingIntermediateAirports[
                                                                            key
                                                                        ]
                                                                            ?.flight_route_id ===
                                                                        route.code
                                                                            ? styles.selected
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        selectOption(
                                                                            "editIntermediateRouteCode",
                                                                            route.code,
                                                                            key,
                                                                        )
                                                                    }
                                                                >
                                                                    {route.code}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <span>
                                                    {stop.flight_route_id}
                                                </span>
                                                {hasChanged &&
                                                    hasChanged.original
                                                        .flight_route_id !==
                                                        stop.flight_route_id && (
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
                                                className={styles.dropdown}
                                                ref={(el) =>
                                                    (dropdownRefs.current[
                                                        `editIntermediateTransitAirport_${key}`
                                                    ] = el)
                                                }
                                                style={{
                                                    zIndex: dropdowns
                                                        .editIntermediateTransitAirport[
                                                        key
                                                    ]
                                                        ? 999999
                                                        : 1000,
                                                }}
                                            >
                                                <button
                                                    className={`${styles.dropdownButtonSmall} ${
                                                        editingIntermediateAirports[
                                                            key
                                                        ]?.transit_airport_name
                                                            ? styles.airlineButton
                                                            : ""
                                                    } ${styles.editingInput}`}
                                                    onClick={() =>
                                                        toggleDropdown(
                                                            "editIntermediateTransitAirport",
                                                            key,
                                                        )
                                                    }
                                                >
                                                    {editingIntermediateAirports[
                                                        key
                                                    ]?.transit_airport_name ||
                                                        "Sân bay trung gian"}
                                                    <ChevronDown
                                                        size={20}
                                                        className={
                                                            styles.inputIcon
                                                        }
                                                    />
                                                </button>
                                                {dropdowns
                                                    .editIntermediateTransitAirport[
                                                    key
                                                ] && (
                                                    <div
                                                        className={
                                                            styles.dropdownMenu
                                                        }
                                                    >
                                                        {airports.map(
                                                            (
                                                                airport,
                                                                airportIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        airportIndex
                                                                    }
                                                                    className={`${styles.dropdownItem} ${
                                                                        editingIntermediateAirports[
                                                                            key
                                                                        ]
                                                                            ?.transit_airport_name ===
                                                                        airport.airport_name
                                                                            ? styles.selected
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        selectOption(
                                                                            "editIntermediateTransitAirport",
                                                                            airport.airport_name,
                                                                            key,
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        airport.airport_name
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
                                                    {stop.transit_airport_name}
                                                </span>
                                                {hasChanged &&
                                                    hasChanged.original
                                                        .transit_airport_name !==
                                                        stop.transit_airport_name && (
                                                        <div
                                                            className={
                                                                styles.oldValue
                                                            }
                                                        >
                                                            Cũ:{" "}
                                                            {
                                                                hasChanged
                                                                    .original
                                                                    .transit_airport_name
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
                                                type="text"
                                                className={`${styles.quantityInput} ${styles.editingInput}`}
                                                placeholder="Thời gian dừng"
                                                value={
                                                    editingIntermediateAirports[
                                                        key
                                                    ]?.stop_time || ""
                                                }
                                                onChange={(e) => {
                                                    setEditingIntermediateAirports(
                                                        {
                                                            ...editingIntermediateAirports,
                                                            [key]: {
                                                                ...editingIntermediateAirports[
                                                                    key
                                                                ],
                                                                stop_time:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        },
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <span>{stop.stop_time}</span>
                                                {hasChanged &&
                                                    hasChanged.original
                                                        .stop_time !==
                                                        stop.stop_time && (
                                                        <div
                                                            className={
                                                                styles.oldValue
                                                            }
                                                        >
                                                            Cũ:{" "}
                                                            {
                                                                hasChanged
                                                                    .original
                                                                    .stop_time
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
                                                type="text"
                                                className={`${styles.quantityInput} ${styles.editingInput}`}
                                                placeholder="Ghi chú"
                                                value={
                                                    editingIntermediateAirports[
                                                        key
                                                    ]?.note || ""
                                                }
                                                onChange={(e) => {
                                                    setEditingIntermediateAirports(
                                                        {
                                                            ...editingIntermediateAirports,
                                                            [key]: {
                                                                ...editingIntermediateAirports[
                                                                    key
                                                                ],
                                                                note: e.target
                                                                    .value,
                                                            },
                                                        },
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <span>{stop.note}</span>
                                                {hasChanged &&
                                                    hasChanged.original.note !==
                                                        stop.note && (
                                                        <div
                                                            className={
                                                                styles.oldValue
                                                            }
                                                        >
                                                            Cũ:{" "}
                                                            {
                                                                hasChanged
                                                                    .original
                                                                    .note
                                                            }
                                                        </div>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <div className={styles.actionButtonGroup}>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    className={
                                                        styles.saveEditButton
                                                    }
                                                    onClick={() =>
                                                        handleSaveEditIntermediate(
                                                            stop,
                                                            index,
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
                                                        handleCancelEditIntermediate(
                                                            stop,
                                                            index,
                                                        )
                                                    }
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {!isNewItem && (
                                                    <button
                                                        className={
                                                            styles.editButton
                                                        }
                                                        onClick={() =>
                                                            handleEditIntermediate(
                                                                stop,
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    className={
                                                        styles.deleteButton
                                                    }
                                                    onClick={() =>
                                                        handleDeleteIntermediate(
                                                            index,
                                                            stop,
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className={styles.tableRowFive}>
                        <div className={styles.tableCell}>
                            <div
                                className={styles.dropdown}
                                ref={(el) =>
                                    (dropdownRefs.current.routeCode = el)
                                }
                                style={{
                                    zIndex: dropdowns.routeCode
                                        ? 999999
                                        : 999998,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${
                                        newIntermediateAirport.flight_route_id
                                            ? styles.airlineButton
                                            : ""
                                    }`}
                                    onClick={() => toggleDropdown("routeCode")}
                                >
                                    {newIntermediateAirport.flight_route_id ||
                                        "Mã tuyến bay"}
                                    {newIntermediateAirport.flight_route_id ? (
                                        <X
                                            size={20}
                                            onClick={(e) =>
                                                clearSelection("routeCode", e)
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
                                {dropdowns.routeCode && (
                                    <div className={styles.dropdownMenu}>
                                        {flightRoutes.map((route, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.dropdownItem} ${
                                                    newIntermediateAirport.flight_route_id ===
                                                    route.code
                                                        ? styles.selected
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    selectOption(
                                                        "routeCode",
                                                        route.code,
                                                    )
                                                }
                                            >
                                                {route.code}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.tableCell}>
                            <div
                                className={styles.dropdown}
                                ref={(el) =>
                                    (dropdownRefs.current.transitAirport = el)
                                }
                                style={{
                                    zIndex: dropdowns.transitAirport
                                        ? 999999
                                        : 999998,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${
                                        newIntermediateAirport.transit_airport_name
                                            ? styles.airlineButton
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleDropdown("transitAirport")
                                    }
                                >
                                    {newIntermediateAirport.transit_airport_name ||
                                        "Sân bay trung gian"}
                                    {newIntermediateAirport.transit_airport_name ? (
                                        <X
                                            size={20}
                                            onClick={(e) =>
                                                clearSelection(
                                                    "transitAirport",
                                                    e,
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
                                {dropdowns.transitAirport && (
                                    <div className={styles.dropdownMenu}>
                                        {airports.map((airport, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.dropdownItem} ${
                                                    newIntermediateAirport.transit_airport_name ===
                                                    airport.airport_name
                                                        ? styles.selected
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    selectOption(
                                                        "transitAirport",
                                                        airport.airport_name,
                                                    )
                                                }
                                            >
                                                {airport.airport_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Thời gian dừng"
                                value={newIntermediateAirport.stop_time}
                                onChange={(e) =>
                                    handleNewIntermediateChange(
                                        "stop_time",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Ghi chú"
                                value={newIntermediateAirport.note}
                                onChange={(e) =>
                                    handleNewIntermediateChange(
                                        "note",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <button
                                className={styles.addButton}
                                onClick={handleAddIntermediate}
                            >
                                <Plus size={16} />
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button
                        className={styles.cancelButton}
                        onClick={handleCancel}
                    >
                        Hủy
                    </button>
                    <button className={styles.saveButton} onClick={handleSave}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
