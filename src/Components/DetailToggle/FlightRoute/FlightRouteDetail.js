import { useState } from "react";
import styles from "./FlightRouteDetail.module.css";
import { Plus, Trash2 } from "lucide-react";

export default function FlightRouteDetail() {
    // State for flight routes
    const [flightRoutes, setFlightRoutes] = useState([
        { code: "SG-HN", departureAirport: "TSN", arrivalAirport: "HAN" },
        { code: "HN-DN", departureAirport: "HAN", arrivalAirport: "DAN" },
        { code: "DN-SG", departureAirport: "DAN", arrivalAirport: "TSN" },
    ]);

    // State for intermediate airports
    const [intermediateAirports, setIntermediateAirports] = useState([
        {
            routeCode: "SG-HN",
            airport: "HUI",
            stopDuration: "45 phút",
            note: "Tiếp nhiên liệu",
        },
        {
            routeCode: "HN-DN",
            airport: "VDO",
            stopDuration: "30 phút",
            note: "Đón khách",
        },
    ]);

    // State for new flight route
    const [newFlightRoute, setNewFlightRoute] = useState({
        code: "",
        departureAirport: "",
        arrivalAirport: "",
    });

    // State for new intermediate airport
    const [newIntermediateAirport, setNewIntermediateAirport] = useState({
        routeCode: "",
        airport: "",
        stopDuration: "",
        note: "",
    });

    // Handle delete flight route
    const handleDeleteRoute = (code) => {
        setFlightRoutes(flightRoutes.filter((route) => route.code !== code));
        setIntermediateAirports(
            intermediateAirports.filter((stop) => stop.routeCode !== code),
        );
    };

    // Handle add new flight route
    const handleAddRoute = () => {
        if (
            newFlightRoute.code &&
            newFlightRoute.departureAirport &&
            newFlightRoute.arrivalAirport
        ) {
            setFlightRoutes([...flightRoutes, { ...newFlightRoute }]);
            setNewFlightRoute({
                code: "",
                departureAirport: "",
                arrivalAirport: "",
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

    // Handle delete intermediate airport
    const handleDeleteIntermediate = (index) => {
        setIntermediateAirports(
            intermediateAirports.filter((_, i) => i !== index),
        );
    };

    // Handle add intermediate airport
    const handleAddIntermediate = () => {
        if (
            newIntermediateAirport.routeCode &&
            newIntermediateAirport.airport &&
            newIntermediateAirport.stopDuration
        ) {
            setIntermediateAirports([
                ...intermediateAirports,
                { ...newIntermediateAirport },
            ]);
            setNewIntermediateAirport({
                routeCode: "",
                airport: "",
                stopDuration: "",
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
        console.log("Hủy được nhấn");
    };

    // Handle save button
    const handleSave = () => {
        console.log("Lưu được nhấn");
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
                                    className={styles.deleteButton}
                                    onClick={() =>
                                        handleDeleteRoute(route.code)
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
                                className={styles.quantityInput}
                                placeholder="Mã tuyến bay"
                                value={newFlightRoute.code}
                                onChange={(e) =>
                                    handleNewRouteChange("code", e.target.value)
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Sân bay đi"
                                value={newFlightRoute.departureAirport}
                                onChange={(e) =>
                                    handleNewRouteChange(
                                        "departureAirport",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Sân bay đến"
                                value={newFlightRoute.arrivalAirport}
                                onChange={(e) =>
                                    handleNewRouteChange(
                                        "arrivalAirport",
                                        e.target.value,
                                    )
                                }
                            />
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
                <h3 className={styles.sectionHeader}>Sân bay trung gian</h3>
                <div className={styles.tableContainer}>
                    <div className={styles.tableHeaderFive}>
                        <div className={styles.tableHeaderCell}>
                            <span>Mã tuyến bay</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Sân bay trung gian</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Thời gian dừng</span>
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
                                {stop.routeCode}
                            </div>
                            <div className={styles.tableCell}>
                                {stop.airport}
                            </div>
                            <div className={styles.tableCell}>
                                {stop.stopDuration}
                            </div>
                            <div className={styles.tableCell}>{stop.note}</div>
                            <div className={styles.tableCell}>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() =>
                                        handleDeleteIntermediate(index)
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
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Mã tuyến bay"
                                value={newIntermediateAirport.routeCode}
                                onChange={(e) =>
                                    handleNewIntermediateChange(
                                        "routeCode",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Sân bay trung gian"
                                value={newIntermediateAirport.airport}
                                onChange={(e) =>
                                    handleNewIntermediateChange(
                                        "airport",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Thời gian dừng"
                                value={newIntermediateAirport.stopDuration}
                                onChange={(e) =>
                                    handleNewIntermediateChange(
                                        "stopDuration",
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
