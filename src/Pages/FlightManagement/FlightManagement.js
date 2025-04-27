import SideBar from "../../Components/SideBar/SideBar.js";
import ManageFilter from "../../Components/Filter/Manage/ManageFilter";
import FlightCardEdit from "../../Components/Info/FlightCardEdit/FlightCardEdit";
import "./FlightManagement.css"; // Đảm bảo bạn tạo file CSS tương ứng

export default function FlightManagement() {
    return (
        <div className="flight-management-container">
            <div className="sidebar-container">
                <SideBar />
            </div>
            <div className="content-container">
                <div className="filter-container">
                    <ManageFilter />
                </div>
                <div className="booking-container">
                    <FlightCardEdit />
                </div>
            </div>
        </div>
    );
}
