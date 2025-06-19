import SideBar from "../../Components/SideBar/SideBar";
import TopBar from "../../Components/TopBar/TopBar";
import RegulationForm from "../../Components/Form/Regulation/RegulationForm";
import AirportDetail from "../../Components/DetailToggle/Airport/AirportDetail";
import FlightRouteDetail from "../../Components/DetailToggle/FlightRoute/FlightRouteDetail";
import TicketClassDetail from "../../Components/DetailToggle/TicketClass/TicketClassDetail";
import styles from "./RegulationSetting.module.css";
import { useState } from "react";

export default function RegulationSetting() {
    const [openForm, setOpenForm] = useState(null);
    const renderForm = () => {
        switch (openForm) {
            case "airport":
                return <AirportDetail onClose={() => setOpenForm(null)} />;
            case "flightRoute":
                return <FlightRouteDetail onClose={() => setOpenForm(null)} />;
            case "ticketClass":
                return <TicketClassDetail onClose={() => setOpenForm(null)} />;
            default:
                return null;
        }
    };
    return (
        <div className={styles["overral-page-container"]}>
            <TopBar />
            <div className={styles["regulation-container"]}>
                <div className={styles["sidebar-section"]}>
                    <SideBar />
                </div>
                <div className={styles["content-section"]}>
                    <RegulationForm setOpenForm={setOpenForm} />
                </div>
            </div>

            {/* Detail Toggle */}
            {openForm && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>{renderForm()}</div>
                </div>
            )}
        </div>
    );
}
