import React from "react";
import SideBar from "../../Components/SideBar/SideBar";
import TicketFilter from "../../Components/Filter/Ticket/TicketFilter";
import FlightTicketEdit from "../../Components/Info/FlightTicketEdit/FlightTicketEdit";
import "./TicketManagement.css";

export default function TicketManagement() {
    return (
        <div className="ticket-management-container">
            <div className="sidebar-container">
                <SideBar />
            </div>
            <div className="content-container">
                <div className="filter-container">
                    <TicketFilter />
                </div>
                <div className="ticket-edit-container">
                    <FlightTicketEdit />
                </div>
            </div>
        </div>
    );
}
