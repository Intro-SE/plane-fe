import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuTicketsPlane, LuClock } from "react-icons/lu";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { TbBuildingAirport } from "react-icons/tb";
import "./FlightFixForm.css";

export default function FlightFixForm() {
    const [flightData, setFlightData] = useState({
        flightCode: "",
        departureAirport: "",
        arrivalAirport: "",
        dateTime: "",
        flightDuration: "",
        seatQuantityClass1: "",
        seatQuantityClass2: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFlightData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Flight data updated:", flightData);
        // Logic to update flight here
    };

    const handleConfirm = (field) => {
        console.log(`Confirmed ${field}: ${flightData[field]}`);
        // Handle confirmation logic for the specific field
    };

    return (
        <div className="flight-form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="input-group full-width">
                        <input
                            type="text"
                            name="flightCode"
                            placeholder="Mã chuyến bay"
                            value={flightData.flightCode}
                            onChange={handleChange}
                        />
                        <span className="icon">
                            <LuTicketsPlane />
                        </span>
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <input
                            type="text"
                            name="departureAirport"
                            placeholder="Sân bay đi"
                            value={flightData.departureAirport}
                            onChange={handleChange}
                        />
                        <span className="icon">
                            <TbBuildingAirport />
                        </span>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="arrivalAirport"
                            placeholder="Sân bay đến"
                            value={flightData.arrivalAirport}
                            onChange={handleChange}
                        />
                        <span className="icon">
                            <TbBuildingAirport />
                        </span>
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <input
                            type="text"
                            name="dateTime"
                            placeholder="Ngày-giờ"
                            value={flightData.dateTime}
                            onChange={handleChange}
                        />
                        <span className="icon">
                            <MdOutlineCalendarMonth />
                        </span>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="flightDuration"
                            placeholder="Thời gian bay"
                            value={flightData.flightDuration}
                            onChange={handleChange}
                        />
                        <span className="icon">
                            <LuClock />
                        </span>
                    </div>
                </div>

                <div className="form-row last-row">
                    <div className="input-group">
                        <input
                            type="text"
                            name="seatQuantityClass1"
                            placeholder="Số lượng ghế hạng 1"
                            value={flightData.seatQuantityClass1}
                            onChange={handleChange}
                        />
                        <span className="icon">
                            <AiOutlineUserAdd />
                        </span>
                    </div>

                    <button
                        type="button"
                        className="confirm-button"
                        onClick={() => handleConfirm("seatQuantityClass1")}
                    >
                        Xác nhận
                    </button>
                </div>

                <div className="form-row last-row">
                    <div className="input-group">
                        <input
                            type="text"
                            name="seatQuantityClass2"
                            placeholder="Số lượng ghế hạng 2"
                            value={flightData.seatQuantityClass2}
                            onChange={handleChange}
                        />
                        <span className="icon">
                            <AiOutlineUserAdd />
                        </span>
                    </div>

                    <button
                        type="button"
                        className="confirm-button"
                        onClick={() => handleConfirm("seatQuantityClass2")}
                    >
                        Xác nhận
                    </button>
                </div>

                <button type="submit" className="submit-button fix-button">
                    Sửa chuyến bay
                </button>
            </form>
        </div>
    );
}
