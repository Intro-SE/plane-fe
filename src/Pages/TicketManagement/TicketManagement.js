import React from "react";
import SideBar from "../../Components/SideBar/SideBar";
import TicketFilter from "../../Components/Filter/Ticket/TicketFilter";
import FlightTicketEdit from "../../Components/Info/FlightTicketEdit/FlightTicketEdit";
import TopBar from "../../Components/TopBar/TopBar";
import styles from "./TicketManagement.module.css";

export default function TicketManagement() {
    return (
        <div className={styles["overral-page-container"]}>
            <TopBar />
            <div className={styles["ticket-management-container"]}>
                <div className={styles["sidebar-container"]}>
                    <SideBar />
                </div>
                <div className={styles["content-container"]}>
                    <div className={styles["filter-container"]}>
                        <TicketFilter />
                    </div>
                    <div className={styles["ticket-edit-container"]}>
                        <FlightTicketEdit />
                    </div>
                </div>
            </div>
        </div>
    );
}
