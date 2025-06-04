import SideBar from "../../Components/SideBar/SideBar.js";
import ManageFilter from "../../Components/Filter/Manage/ManageFilter";
import AddFlightForm from "../../Components/Form/AddFlight/AddFlightForm";
import FlightCardEdit from "../../Components/Info/FlightCardEdit/FlightCardEdit";
import styles from "./FlightManagement.module.css";
import TopBar from "../../Components/TopBar/TopBar";
import { FaPlus } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { IoTicketOutline } from "react-icons/io5";
import { TbBuildingAirport } from "react-icons/tb";
import { TbCalendarClock } from "react-icons/tb";
import { FiClock } from "react-icons/fi";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { MdOutlineEventSeat } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { RiListSettingsLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";
import { FaPlusSquare } from "react-icons/fa";
import { Plus, Trash2, X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../api.js";

export default function FlightManagement() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddFlightFormOpen, setIsAddFlightFormOpen] = useState(false);
    const [routeData, setRouteData] = useState([]);
    const [seatClassData, setSeatClassData] = useState([]);

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
        // try {
        //     const reponse = await axios.put()
        // }
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
                                    // onClick={handleDeleteSelected}
                                    className={styles.button}
                                >
                                    <Trash2 size={16} className={styles.icon} />
                                    Xóa Chuyến bay đã chọn
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

                    <div className={styles["card-container"]}>
                        {flights.map((flight) => (
                            <FlightCardEdit
                                key={flight.flight_id}
                                data={flight}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
