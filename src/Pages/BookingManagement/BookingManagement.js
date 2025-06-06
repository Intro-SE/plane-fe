import SideBar from "../../Components/SideBar/SideBar.js";
import TicketFilter from "../../Components/Filter/Ticket/TicketFilter";
import FlightTicket from "../../Components/Info/FlightTicket/FlightTicket";
import TopBar from "../../Components/TopBar/TopBar";
import styles from "./BookingManagement.module.css"; // Chuyển từ .css sang .module.css

export default function BookingManagement() {
    return (
        <div className={styles["overral-page-container"]}>
            <TopBar />
            <div className={styles["booking-management"]}>
                <div className={styles["sidebar-container"]}>
                    <SideBar />
                </div>
                <div className={styles["content-container"]}>
                    <div className={styles["filter-container"]}>
                        <TicketFilter />
                    </div>
                    <div className={styles["ticket-container"]}>
                        <FlightTicket />
                    </div>
                </div>
            </div>
        </div>
    );
}
