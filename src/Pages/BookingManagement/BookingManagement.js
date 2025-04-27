import SideBar from "../../Components/SideBar/SideBar.js";
import TicketFilter from "../../Components/Filter/Ticket/TicketFilter";
import FlightTicket from "../../Components/Info/FlightTicket/FlightTicket";
import "./BookingManagement.css"; // Tạo file CSS để styling

export default function BookingManagement() {
    return (
        <div className="booking-management">
            <div className="sidebar-container">
                <SideBar />
            </div>
            <div className="content-container">
                <div className="filter-container">
                    <TicketFilter />
                </div>
                <div className="ticket-container">
                    <FlightTicket />
                </div>
            </div>
        </div>
    );
}
