import SideBar from "../../Components/SideBar/SideBar.js";
import ManageFilter from "../../Components/Filter/Manage/ManageFilter";
import AddFlightForm from "../../Components/Form/AddFlight/AddFlightForm";
import FixFlightForm from "../../Components/Form/FixFlight/FixFlightForm";
import FlightCardEdit from "../../Components/Info/FlightCardEdit/FlightCardEdit";
import styles from "./FlightManagement.module.css";
import TopBar from "../../Components/TopBar/TopBar";
import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../api.js";

export default function FlightManagement() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddFlightFormOpen, setIsAddFlightFormOpen] = useState(false);
    const [isUpdateFlightFormOpen, setIsUpdateFlightFormOpen] = useState(false);
    const [routeData, setRouteData] = useState([]);
    const [seatClassData, setSeatClassData] = useState([]);
    const [formData, setFormData] = useState({});
    const [selectedFlights, setSelectedFlights] = useState([]);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/flight`, {
                    headers: {
                        Accept: "application/json",
                    },
                });

                setFlights(response.data);
            } catch (error) {
                console.error(
                    "Lỗi khi lấy dữ liệu chuyến bay:",
                    error.response?.data || error.message,
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    const handleFilter = async (data) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/flight_management/search`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            setFlights(response.data);
        } catch (error) {
            console.error(
                "Lỗi khi tìm kiếm chuyến bay",
                error.response?.data || error.message,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddFlight = async (data) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/flight_management/create`,
                data,
            );
            console.log("Thêm chuyến bay thành công", response.data);
        } catch (error) {
            console.error(
                "Lỗi khi thêm chuyến bay",
                error.response?.data || error.message,
            );
        }
    };

    const handleUpdateFlight = async (data) => {
        console.log(data);
        try {
            const response = await axios.put(
                `${BASE_URL}/api/v1/flight_management/update`,
                data,
            );
            console.log("Cập nhật chuyến bay thành công", response.data);
        } catch (error) {
            console.error(
                "Lỗi khi cập nhật chuyến bay",
                error.response?.data || error.message,
            );
        }
    };

    const handleOpenUpdateFlightForm = async (data) => {
        setFormData(data);
        setIsUpdateFlightFormOpen(true);
    };

    const handleOpenAddFlightForm = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/v1/flightroutes_crud`,
            );
            const routes = response.data;

            const airportPairs = routes.map((route) => ({
                departure_airport: route.departure_airport,
                arrival_airport: route.arrival_airport,
            }));

            setRouteData(airportPairs);
            setIsAddFlightFormOpen(true);
        } catch (error) {
            console.error(
                "Lỗi khi lấy tuyến bay",
                error.message?.data || error.message,
            );
        }
        const seatClass = ["Phổ thông", "Thương gia", "Cao cấp", "Nhất"];
        setSeatClassData(seatClass);
    };

    const handleFlightSelect = (flightId, isSelected) => {
        if (isSelected) {
            setSelectedFlights((prev) => [...prev, flightId]);
        } else {
            setSelectedFlights((prev) => prev.filter((id) => id !== flightId));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedFlights.length === 0) {
            alert("Vui lòng chọn ít nhất một chuyến bay để xóa");
            return;
        }

        if (
            window.confirm(
                `Bạn có chắc chắn muốn xóa ${selectedFlights.length} chuyến bay đã chọn?`,
            )
        ) {
            try {
                await Promise.all(
                    selectedFlights.map((flightId) =>
                        axios.delete(
                            `${BASE_URL}/api/v1/flight_management/delete/`,
                        ),
                    ),
                );

                // Cập nhật danh sách chuyến bay sau khi xóa
                setFlights((prev) =>
                    prev.filter(
                        (flight) => !selectedFlights.includes(flight.flight_id),
                    ),
                );
                setSelectedFlights([]);
                console.log("Xóa chuyến bay thành công");
            } catch (error) {
                console.error(
                    "Lỗi khi xóa chuyến bay:",
                    error.response?.data || error.message,
                );
            }
        }
    };

    return (
        <div className={styles["overral-page-container"]}>
            <TopBar />
            <div className={styles["flight-management-container"]}>
                <div className={styles["sidebar-container"]}>
                    <SideBar />
                </div>
                <div className={styles["content-container"]}>
                    <div className={styles["filter-container"]}>
                        <ManageFilter onSendData={handleFilter} />
                    </div>

                    <div className={styles.container}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>
                                Danh sách các chuyến bay dựa theo bộ lọc
                            </h1>

                            <div className={styles.actions}>
                                <button
                                    onClick={handleOpenAddFlightForm}
                                    className={styles.button}
                                >
                                    <Plus size={16} className={styles.icon} />
                                    Thêm chuyến bay
                                </button>

                                <button
                                    onClick={handleDeleteSelected}
                                    className={`${styles.button} ${selectedFlights.length > 0 ? styles["delete-active"] : ""}`}
                                >
                                    <Trash2 size={16} className={styles.icon} />
                                    Xóa chuyến bay đã chọn (
                                    {selectedFlights.length})
                                </button>
                            </div>
                        </div>
                    </div>

                    {isAddFlightFormOpen && (
                        <div className={styles.overlay}>
                            <div className={styles.modal}>
                                <AddFlightForm
                                    onClose={() =>
                                        setIsAddFlightFormOpen(false)
                                    }
                                    routeData={routeData}
                                    seatClassData={seatClassData}
                                    onSendData={handleAddFlight}
                                />
                            </div>
                        </div>
                    )}

                    {isUpdateFlightFormOpen && (
                        <div className={styles.overlay}>
                            <div className={styles.modal}>
                                <FixFlightForm
                                    onClose={() =>
                                        setIsUpdateFlightFormOpen(false)
                                    }
                                    routeData={routeData}
                                    seatClassData={seatClassData}
                                    onSendData={handleUpdateFlight}
                                    data={formData}
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles["card-container"]}>
                        {flights.map((flight) => (
                            <FlightCardEdit
                                key={flight.flight_id}
                                data={flight}
                                onSendData={handleOpenUpdateFlightForm}
                                onFlightSelect={handleFlightSelect}
                                isSelected={selectedFlights.includes(
                                    flight.flight_id,
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
