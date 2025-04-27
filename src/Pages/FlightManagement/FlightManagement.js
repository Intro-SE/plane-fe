import SideBar from "../../Components/SideBar/SideBar.js";
import ManageFilter from "../../Components/Filter/Manage/ManageFilter";
import FlightCardEdit from "../../Components/Info/FlightCardEdit/FlightCardEdit";
import "./FlightManagement.css";

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

                {/* Add the heading and buttons section */}
                <div className="action-section">
                    <h2 className="section-title">
                        Danh sách các chuyến bay dựa theo bộ lọc
                    </h2>
                    <div className="action-buttons">
                        <button className="action-button add-button">
                            Thêm
                        </button>
                        <button className="action-button delete-button">
                            Xóa
                        </button>
                        <button className="action-button edit-button">
                            Sửa
                        </button>
                    </div>
                </div>

                <div className="booking-container">
                    <FlightCardEdit />
                </div>
            </div>
        </div>
    );
}
