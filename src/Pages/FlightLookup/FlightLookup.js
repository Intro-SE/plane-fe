import SideBar from "../../Components/SideBar/SideBar.js";
import LookupFilter from "../../Components/Filter/Lookup/LookupFilter";
import FlightCard from "../../Components/Info/FlightCard/FlightCard.js";
import styles from "./FlightLookup.module.css";
import TopBar from "../../Components/TopBar/TopBar.js";
import { useEffect, useState } from "react";

export default function FlightLookup() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/flight/?skip=0&limit=100",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // ✅ QUAN TRỌNG
            },
          }
        ); // Thay URL phù hợp

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setFlights(result);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vé:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);
  return (
    <div className={styles["overral-page-container"]}>
      <TopBar />
      <div className={styles["flight-lookup-container"]}>
        <div className={styles["sidebar-container"]}>
          <SideBar />
        </div>
        <div className={styles["main-content"]}>
          <div className={styles["filter-container"]}>
            <LookupFilter />
          </div>
          <div className={styles["card-container"]}>
            {flights.map((flight) => (
              <FlightCard key={flight.flight_id} data={flight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
