import React, { useState } from "react";
import "./FixRule.css";

export default function FixRule() {
    const [formData, setFormData] = useState({
        flightCount: "10",
        minFlightTime: "30",
        intermediateAirports: "2",
        minStopTime: "10",
        maxStopTime: "20",
        latestBookingTime: "24",
        latestCancellationTime: "24",
        flightRoute: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="flight-form-container">
            <div className="form-group">
                <label>Số lượng sân bay</label>
                <input
                    type="text"
                    name="flightCount"
                    value={formData.flightCount}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Thời gian bay tối thiểu</label>
                <input
                    type="text"
                    name="minFlightTime"
                    value={formData.minFlightTime}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Số sân bay trung gian</label>
                <input
                    type="text"
                    name="intermediateAirports"
                    value={formData.intermediateAirports}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Thời gian dừng tối thiểu</label>
                <input
                    type="text"
                    name="minStopTime"
                    value={formData.minStopTime}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Thời gian dừng tối đa</label>
                <input
                    type="text"
                    name="maxStopTime"
                    value={formData.maxStopTime}
                    onChange={handleChange}
                />
            </div>

            <div className="divider"></div>

            <div className="form-group">
                <label>Thời gian chậm nhất khi đặt vé (giờ)</label>
                <input
                    type="text"
                    name="latestBookingTime"
                    value={formData.latestBookingTime}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Thời gian chậm nhất khi hủy vé (giờ)</label>
                <input
                    type="text"
                    name="latestCancellationTime"
                    value={formData.latestCancellationTime}
                    onChange={handleChange}
                />
            </div>

            <div className="divider"></div>

            <div className="form-group">
                <label>Chọn tuyến bay</label>
                <select
                    name="flightRoute"
                    value={formData.flightRoute}
                    onChange={handleChange}
                >
                    <option value="">...</option>
                    <option value="route1">Hà Nội - TP.HCM</option>
                    <option value="route2">TP.HCM - Đà Nẵng</option>
                    <option value="route3">Hà Nội - Đà Nẵng</option>
                </select>
            </div>
        </div>
    );
}
