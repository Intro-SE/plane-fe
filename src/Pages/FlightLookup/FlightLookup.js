import SideBar from "../../Components/SideBar/SideBar.js";
import LookupFilter from "../../Components/Filter/Lookup/LookupFilter";
import FlightCard from "../../Components/Info/FlightCard/FlightCard.js";
import styles from "./FlightLookup.module.css";
import TopBar from "../../Components/TopBar/TopBar.js";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../api.js";

export default function FlightLookup() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    // Loading Component
    const LoadingComponent = () => (
        <div className={styles["loading-overlay"]}>
            <div className={styles["loading-container"]}>
                <div className={styles["loading-spinner"]}>
                    <Loader size={32} className={styles["spinner-icon"]} />
                </div>
                <div className={styles["loading-text"]}>
                    Đang tải dữ liệu chuyến bay...
                </div>
                <div className={styles["loading-dots"]}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                </div>
            </div>
        </div>
    );

    // Skeleton Loading Card Component
    const SkeletonCard = () => (
        <div className={styles["skeleton-card"]}>
            <div className={styles["skeleton-header"]}>
                <div
                    className={styles["skeleton-text"]}
                    style={{ width: "120px", height: "20px" }}
                ></div>
                <div
                    className={styles["skeleton-text"]}
                    style={{ width: "80px", height: "16px" }}
                ></div>
            </div>
            <div className={styles["skeleton-content"]}>
                <div className={styles["skeleton-row"]}>
                    <div
                        className={styles["skeleton-text"]}
                        style={{ width: "60%", height: "16px" }}
                    ></div>
                    <div
                        className={styles["skeleton-text"]}
                        style={{ width: "30%", height: "16px" }}
                    ></div>
                </div>
                <div className={styles["skeleton-row"]}>
                    <div
                        className={styles["skeleton-text"]}
                        style={{ width: "50%", height: "16px" }}
                    ></div>
                    <div
                        className={styles["skeleton-text"]}
                        style={{ width: "40%", height: "16px" }}
                    ></div>
                </div>
                <div className={styles["skeleton-row"]}>
                    <div
                        className={styles["skeleton-text"]}
                        style={{ width: "70%", height: "16px" }}
                    ></div>
                    <div
                        className={styles["skeleton-text"]}
                        style={{ width: "25%", height: "16px" }}
                    ></div>
                </div>
            </div>
            <div className={styles["skeleton-footer"]}>
                <div className={styles["skeleton-button"]}></div>
                <div className={styles["skeleton-button"]}></div>
            </div>
        </div>
    );

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
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/flight/search`,
                data,
            );
            setFlights(response.data);
        } catch (error) {
            console.error(
                "Lỗi khi tìm kiếm chuyến bay:",
                error.response?.data || error.message,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles["overral-page-container"]}>
            <TopBar />
            <div className={styles["flight-lookup-container"]}>
                <div className={styles["sidebar-container"]}>
                    <SideBar />
                </div>
                <div className={styles["content-container"]}>
                    {loading && <LoadingComponent />}
                    <div
                        className={`${styles["filter-container"]} ${loading ? styles["loading-blur"] : ""}`}
                    >
                        <LookupFilter onSendData={handleFilter} />
                    </div>

                    <div className={styles.container}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>
                                Danh sách các chuyến bay có sẵn
                                <span className={styles["flight-count"]}>
                                    {flights.length}
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div
                        className={`${styles["card-container"]} ${loading ? styles["loading-blur"] : ""}`}
                    >
                        {loading && (
                            <>
                                {[...Array(3)].map((_, index) => (
                                    <SkeletonCard key={`skeleton-${index}`} />
                                ))}
                            </>
                        )}
                        {!loading &&
                            flights
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
                                    <FlightCard
                                        key={flight.flight_id}
                                        data={flight}
                                    />
                                ))}
                        {!loading && flights.length === 0 && (
                            <div className={styles["empty-state"]}>
                                <div className={styles["empty-icon"]}>✈️</div>
                                <div className={styles["empty-text"]}>
                                    Không có chuyến bay nào được tìm thấy
                                </div>
                                <div className={styles["empty-subtext"]}>
                                    Thử điều chỉnh bộ lọc tìm kiếm
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
