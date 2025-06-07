import SideBar from "../../Components/SideBar/SideBar.js";
import LookupFilter from "../../Components/Filter/Lookup/LookupFilter";
import FlightCard from "../../Components/Info/FlightCard/FlightCard.js";
import styles from "./FlightLookup.module.css";
import TopBar from "../../Components/TopBar/TopBar.js";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../api.js";

export default function FlightLookup() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <div className={styles["filter-container"]}>
                        <LookupFilter onSendData={handleFilter} />
                    </div>

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
                                <FlightCard
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
