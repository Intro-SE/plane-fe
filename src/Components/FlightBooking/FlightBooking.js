import React from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { FiTrash2 } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import "./FlightBooking.css";

export default function FlightBooking() {
    return (
        <div className="flight-ticket">
            {/* Flight Code & Info Section */}
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

            {/* Vertical divider */}
            <div className="divider"></div>

            {/* Flight Path Section */}
            <div className="route-section">
                {/* Departure */}
                <div className="time-location-section">
                    <div className="time">10:00</div>
                    <div className="location">Sài Gòn</div>
                </div>

                {/* Flight Path Visualization */}
                <div className="flight-path-section">
                    <div className="flight-path">
                        <div className="line"></div>
                    </div>
                    <div className="airport-codes">
                        <span className="airport-code left-code">TSN</span>
                        <span className="airport-code right-code">NB</span>
                    </div>
                </div>

                {/* Arrival */}
                <div className="time-location-section">
                    <div className="time">12:00</div>
                    <div className="location">Hà Nội</div>
                </div>
            </div>

            {/* Vertical divider */}
            <div className="divider"></div>

            {/* Layover Information */}
            <div className="layover-section">
                <div className="layover-label">Số điểm dừng trung gian: 1</div>
                <div className="layover-detail">Đà Nẵng - 30 phút</div>
            </div>

            {/* Vertical divider */}
            <div className="divider"></div>

            {/* Seat Information */}
            <div className="seat-info-section">
                <div className="seat-info">Số ghế trống: 170</div>
                <div className="seat-info">Số ghế đặt: 100</div>
            </div>

            {/* Action Buttons */}
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
