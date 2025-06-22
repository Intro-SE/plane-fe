import { useState, useEffect, useRef } from "react";
import styles from "./FlightRouteDetail.module.css";
import { Plus, Trash2, ChevronDown, X } from "lucide-react";
import axios from "axios";

export default function FlightRouteDetail({ setToast, onClose }) {
    console.log(888);
    const [flightRoutes, setFlightRoutes] = useState([]);
    const [newFlightRoutes, setNewFlightRoutes] = useState([]);
    const [intermediateAirports, setIntermediateAirports] = useState([]);
    const [newIntermediateAirports, setNewIntermediateAirports] = useState([]);
    const [airports, setAirports] = useState([]);

    // Dropdown states
    const [dropdowns, setDropdowns] = useState({
        departureAirport: false,
        arrivalAirport: false,
        transitAirport: false,
        routeCode: false,
    });

    const dropdownRefs = useRef({});
    useEffect(() => {
        const fetchAllData = async () => {
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
                }));

                setFlightRoutes(routes);
                setIntermediateAirports(intermediateAirportsRes.data);
                setAirports(airportsRes.data || []);
            } catch (error) {
                console.log(
                    "Lỗi khi lấy dữ liệu:",
                    error.response?.data || error.message,
                );
            }
        };

        fetchAllData();
    }, []);

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

    // State for new flight route
    const [newFlightRoute, setNewFlightRoute] = useState({
        code: "",
        departureAirport: "",
        arrivalAirport: "",
        departureAirportID: "",
        arrivalAirportID: "",
    });

    // State for new intermediate airport
    const [newIntermediateAirport, setNewIntermediateAirport] = useState({
        flight_route_id: "",
        transit_airport_name: "",
        stop_time: "",
        note: "",
    });

    // Handle delete flight route
    const handleDeleteRoute = (internalId) => {
        // Remove from newFlightRoutes array
        setNewFlightRoutes(
            newFlightRoutes.filter((route) => route.internalId !== internalId),
        );
        // Remove from flightRoutes array
        setFlightRoutes(
            flightRoutes.filter((route) => route.internalId !== internalId),
        );
    };

    // Handle add new flight route
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

    // Handle change in new flight route
    const handleNewRouteChange = (field, value) => {
        setNewFlightRoute({
            ...newFlightRoute,
            [field]: value,
        });
    };

    // Toggle dropdown
    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }));
    };

    // Select option from dropdown
    const selectOption = (field, value) => {
        if (field === "departureAirport" || field === "arrivalAirport") {
            const { name, id } = value;
            setNewFlightRoute((prev) => ({
                ...prev,
                [field]: name,
                [field + "ID"]: id,
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
        }
        setDropdowns((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    // Clear selection
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

    // Handle delete intermediate airport
    const handleDeleteIntermediate = (index, airport) => {
        // Remove from intermediateAirports array using index
        setIntermediateAirports(
            intermediateAirports.filter((_, i) => i !== index),
        );
        // Remove from newIntermediateAirports array using matching properties
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
    };

    // Handle add intermediate airport
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

    // Handle change in new intermediate airport
    const handleNewIntermediateChange = (field, value) => {
        setNewIntermediateAirport({
            ...newIntermediateAirport,
            [field]: value,
        });
    };

    // Handle cancel button
    const handleCancel = () => {
        onClose();
    };

    // Handle save button
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

            setToast({
                show: true,
                type: "success",
                message: "Cập nhật tuyến bay thành công!",
            });
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

            setToast({
                show: true,
                type: "success",
                message: "Cập nhật sân bay trung gian thành công!",
            });
        };

        try {
            await Promise.all([saveFlightRoutes(), saveIntermediateAirports()]);
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
                <div className={styles.tableContainer}>
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

                    {flightRoutes.map((route, index) => (
                        <div key={index} className={styles.tableRow}>
                            <div className={styles.tableCell}>{route.code}</div>
                            <div className={styles.tableCell}>
                                {route.departureAirport}
                            </div>
                            <div className={styles.tableCell}>
                                {route.arrivalAirport}
                            </div>
                            <div className={styles.tableCell}>
                                <button
                                    className={`${styles.deleteButton} ${
                                        !newFlightRoutes.some(
                                            (item) =>
                                                item.internalId ===
                                                route.internalId,
                                        )
                                            ? styles.disabledButton
                                            : ""
                                    }`}
                                    onClick={() =>
                                        newFlightRoutes.some(
                                            (item) =>
                                                item.internalId ===
                                                route.internalId,
                                        ) && handleDeleteRoute(route.internalId)
                                    }
                                    disabled={
                                        !newFlightRoutes.some(
                                            (item) =>
                                                item.internalId ===
                                                route.internalId,
                                        )
                                    }
                                >
                                    <Trash2 size={16} />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}

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
                                        ? 2500
                                        : 1000,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${newFlightRoute.departureAirport ? styles.airlineButton : ""}`}
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
                                        ? 2500
                                        : 1000,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${newFlightRoute.arrivalAirport ? styles.airlineButton : ""}`}
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
                <div className={styles.tableContainer}>
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

                    {intermediateAirports.map((stop, index) => (
                        <div key={index} className={styles.tableRowFive}>
                            <div className={styles.tableCell}>
                                {stop.flight_route_id}
                            </div>
                            <div className={styles.tableCell}>
                                {stop.transit_airport_name}
                            </div>
                            <div className={styles.tableCell}>
                                {stop.stop_time}
                            </div>
                            <div className={styles.tableCell}>{stop.note}</div>
                            <div className={styles.tableCell}>
                                <button
                                    className={`${styles.deleteButton} ${
                                        !newIntermediateAirports.some(
                                            (item) =>
                                                item.flight_route_id ===
                                                    stop.flight_route_id &&
                                                item.transit_airport_name ===
                                                    stop.transit_airport_name &&
                                                item.stop_time ===
                                                    stop.stop_time,
                                        )
                                            ? styles.disabledButton
                                            : ""
                                    }`}
                                    onClick={() =>
                                        newIntermediateAirports.some(
                                            (item) =>
                                                item.flight_route_id ===
                                                    stop.flight_route_id &&
                                                item.transit_airport_name ===
                                                    stop.transit_airport_name &&
                                                item.stop_time ===
                                                    stop.stop_time,
                                        ) &&
                                        handleDeleteIntermediate(index, stop)
                                    }
                                    disabled={
                                        !newIntermediateAirports.some(
                                            (item) =>
                                                item.flight_route_id ===
                                                    stop.flight_route_id &&
                                                item.transit_airport_name ===
                                                    stop.transit_airport_name &&
                                                item.stop_time ===
                                                    stop.stop_time,
                                        )
                                    }
                                >
                                    <Trash2 size={16} />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className={styles.tableRowFive}>
                        <div className={styles.tableCell}>
                            <div
                                className={styles.dropdown}
                                ref={(el) =>
                                    (dropdownRefs.current.routeCode = el)
                                }
                                style={{
                                    zIndex: dropdowns.routeCode ? 2500 : 1000,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${newIntermediateAirport.flight_route_id ? styles.airlineButton : ""}`}
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
                                        ? 2500
                                        : 1000,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${newIntermediateAirport.transit_airport_name ? styles.airlineButton : ""}`}
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
