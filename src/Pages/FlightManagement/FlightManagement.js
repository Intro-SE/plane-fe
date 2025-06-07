import SideBar from "../../Components/SideBar/SideBar.js";
import ManageFilter from "../../Components/Filter/Manage/ManageFilter";
import AddFlightForm from "../../Components/Form/AddFlight/AddFlightForm";
import FixFlightForm from "../../Components/Form/FixFlight/FixFlightForm";
import FlightCardEdit from "../../Components/Info/FlightCardEdit/FlightCardEdit";
import ConfirmDialog from "../../Components/Dialog/Confirm/ConfirmDialog";
import MessageDialog from "../../Components/Dialog/Message/MessageDialog";
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [handleConfirm, setHandleConfirm] = useState();
    const [handleCancel, setHandleCancel] = useState();
    const [toast, setToast] = useState({
        show: false,
        type: "",
        message: "",
    });

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
                console.log(
                    "Lỗi khi lấy dữ liệu chuyến bay:",
                    error.response?.data || error.message,
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    useEffect(() => {
        const fetchFlightRoutes = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/v1/flightroutes_crud`,
                );
                const routes = response.data;

                const airportData = routes.map((route) => ({
                    flight_route: route.flight_route_id,
                    departure_airport: route.departure_airport,
                    arrival_airport: route.arrival_airport,
                }));

                setRouteData(airportData);
            } catch (error) {
                console.log(
                    "Lỗi khi lấy tuyến bay",
                    error.message?.data || error.message,
                );
            }
            const seatClass = ["Phổ thông", "Thương gia", "Cao cấp", "Nhất"];
            setSeatClassData(seatClass);
        };
        fetchFlightRoutes();
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
            console.log(
                "Lỗi khi tìm kiếm chuyến bay",
                error.response?.data || error.message,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddFlight = async (data) => {
        const handleConfirm = async () => {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/v1/flight_management/create`,
                    data,
                );
                console.log("Thêm chuyến bay thành công", response.data);
                setFlights((prevFlights) => [...prevFlights, response.data]);
                setToast({
                    show: true,
                    type: "success",
                    message: "Thêm chuyến bay thành công!",
                });
            } catch (error) {
                console.log(
                    "Lỗi khi thêm chuyến bay",
                    error.response?.data || error.message,
                );
                setToast({
                    show: true,
                    type: "error",
                    message: "Thêm chuyến bay không thành công!",
                });
            } finally {
                setIsDialogOpen(false);
            }
        };

        setMessage(`Bạn chắc chắn muốn thêm chuyến bay này đúng không?`);
        setHandleConfirm(() => handleConfirm);
        setHandleCancel(() => () => {
            setIsDialogOpen(false);
        });
        setIsDialogOpen(true);
    };

    const handleUpdateFlight = async (data) => {
        console.log(data);
        try {
            const response = await axios.put(
                `${BASE_URL}/api/v1/flight_management/update`,
                data,
            );
            console.log("Cập nhật chuyến bay thành công", response.data);
            setFlights((prevFlights) =>
                prevFlights.map((flight) =>
                    flight.flight_id === response.data.flight_id
                        ? response.data
                        : flight,
                ),
            );
            setToast({
                show: true,
                type: "success",
                message: "Cập nhật chuyến bay thành công!",
            });
        } catch (error) {
            console.log(
                "Lỗi khi cập nhật chuyến bay",
                error.response?.data || error.message,
            );
            setToast({
                show: true,
                type: "error",
                message: "Cập nhật chuyến bay không thành công!",
            });
        }
    };

    const handleOpenUpdateFlightForm = async (data) => {
        setFormData(data);
        setIsUpdateFlightFormOpen(true);
    };

    const handleOpenAddFlightForm = async () => {
        setIsAddFlightFormOpen(true);
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
        const handleConfirm = async () => {
            try {
                const response = await axios.delete(
                    `${BASE_URL}/api/v1/flight_management/delete`,
                    {
                        data: selectedFlights,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                console.log(response);

                // Cập nhật danh sách chuyến bay sau khi xóa
                setFlights((prev) =>
                    prev.filter(
                        (flight) => !selectedFlights.includes(flight.flight_id),
                    ),
                );
                console.log("Xóa chuyến bay thành công");
                setToast({
                    show: true,
                    type: "success",
                    message: "Xóa chuyến bay thành công!",
                });
            } catch (error) {
                console.log(
                    "Lỗi khi xóa chuyến bay:",
                    error.response?.data || error.message,
                );
                setToast({
                    show: true,
                    type: "error",
                    message: "Xóa chuyến bay không thành công!",
                });
            } finally {
                setSelectedFlights([]);
                setIsDialogOpen(false);
            }
        };

        setMessage(
            `Bạn chắc chắn muốn xóa ${selectedFlights.length} chuyến bay này đúng không?`,
        );
        setHandleConfirm(() => handleConfirm);
        setHandleCancel(() => () => {
            setSelectedFlights([]);
            setIsDialogOpen(false);
        });
        setIsDialogOpen(true);
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
                    {isDialogOpen && (
                        <div>
                            <ConfirmDialog
                                open={isDialogOpen}
                                message={message}
                                onConfirm={handleConfirm}
                                onCancel={handleCancel}
                            />
                        </div>
                    )}

                    <MessageDialog
                        show={toast.show}
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                    <div className={styles["card-container"]}>
                        {flights
                            .slice()
                            .sort((a, b) => {
                                const numA = parseInt(
                                    a.flight_id.replace(/\D/g, ""),
                                );
                                const numB = parseInt(
                                    b.flight_id.replace(/\D/g, ""),
                                );
                                return numA - numB;
                            })
                            .map((flight) => (
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
