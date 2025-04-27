import React from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { FiTrash2 } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import "./FlightCardEdit.css";

export default function FlightCardEdit() {
    return (
        <div className="flight-card">
            <div className="flight-code-section">
                <div className="flight-code">VJ-123</div>
                <div className="flight-info-row">
                    <div className="flight-date">
                        <MdOutlineCalendarMonth className="icon-small" />
                        <span>01-01-2025</span>
                    </div>
                    <div className="seat-count">
                        <span className="seat-icon">
                            <GrGroup className="icon-small" />
                        </span>
                        <span>170</span>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            <div className="route-section">
                <div className="time-location-section">
                    <div className="time">10:00</div>
                    <div className="location">Sài Gòn</div>
                </div>

                <div className="flight-path-section">
                    <div className="flight-path">
                        <div className="line"></div>
                    </div>
                    <div className="airport-codes">
                        <span className="airport-code left-code">TSN</span>
                        <span className="airport-code right-code">NB</span>
                    </div>
                </div>

                <div className="time-location-section">
                    <div className="time">12:00</div>
                    <div className="location">Hà Nội</div>
                </div>
            </div>

            <div className="divider"></div>

            <div className="layover-section">
                <div className="layover-label">Số điểm dừng trung gian: 1</div>
                <div className="layover-detail">Đà Nẵng - 30 phút</div>
            </div>

            <div className="divider"></div>

            <div className="seat-info-section">
                <div className="seat-info">Số ghế trống: 170</div>
                <div className="seat-info">Số ghế đặt: 100</div>
            </div>

            <div className="action-section">
                <div className="action-row">
                    <FiTrash2 className="action-icon" />
                    <input type="checkbox" id="delete-checkbox" />
                </div>
                <div className="action-row">
                    <TbEdit className="action-icon" />
                    <input type="checkbox" id="settings-checkbox" />
                </div>
            </div>
        </div>
    );
}
