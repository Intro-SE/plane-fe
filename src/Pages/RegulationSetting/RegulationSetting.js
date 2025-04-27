import React from "react";
import SideBar from "../../Components/SideBar/SideBar";
import FixRule from "../../Components/Form/FixRule/FixRule";
import "./RegulationSetting.css"; // Tạo file CSS riêng

export default function RegulationSetting() {
    return (
        <div className="regulation-container">
            <div className="sidebar-section">
                <SideBar />
            </div>
            <div className="content-section">
                <FixRule />
            </div>
        </div>
    );
}
