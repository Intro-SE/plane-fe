import SideBar from "../../Components/SideBar/SideBar.js";
import LookupFilter from "../../Components/Filter/Lookup/LookupFilter";
import FlightCard from "../../Components/Info/FlightCard/FlightCard.js";
import styles from "./FlightLookup.module.css";
import TopBar from "../../Components/TopBar/TopBar.js";

export default function FlightLookup() {
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
            <FlightCard />
          </div>
        </div>
      </div>
    </div>
  );
}
