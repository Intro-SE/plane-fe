import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuTicketsPlane, LuClock } from "react-icons/lu";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { TbBuildingAirport } from "react-icons/tb";
import styles from "./AddFlightForm.module.css";

export default function AddFlightForm() {
    const [flightData, setFlightData] = useState({
        flightCode: "",
        departureAirport: "",
        arrivalAirport: "",
        dateTime: "",
        flightDuration: "",
        seatQuantity: "",
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
        console.log("Flight data submitted:", flightData);
    };

    return (
        <div className={styles["flight-form-container"]}>
            <form onSubmit={handleSubmit}>
                <div className={styles["form-row"]}>
                    <div
                        className={`${styles["input-group"]} ${styles["full-width"]}`}
                    >
                        <input
                            type="text"
                            name="flightCode"
                            placeholder="Mã chuyến bay"
                            value={flightData.flightCode}
                            onChange={handleChange}
                        />
                        <span className={styles.icon}>
                            <LuTicketsPlane />
                        </span>
                    </div>
                </div>

                <div className={styles["form-row"]}>
                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            name="departureAirport"
                            placeholder="Sân bay đi"
                            value={flightData.departureAirport}
                            onChange={handleChange}
                        />
                        <span className={styles.icon}>
                            <TbBuildingAirport />
                        </span>
                    </div>

                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            name="arrivalAirport"
                            placeholder="Sân bay đến"
                            value={flightData.arrivalAirport}
                            onChange={handleChange}
                        />
                        <span className={styles.icon}>
                            <TbBuildingAirport />
                        </span>
                    </div>
                </div>

                <div className={styles["form-row"]}>
                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            name="dateTime"
                            placeholder="Ngày-giờ"
                            value={flightData.dateTime}
                            onChange={handleChange}
                        />
                        <span className={styles.icon}>
                            <MdOutlineCalendarMonth />
                        </span>
                    </div>

                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            name="flightDuration"
                            placeholder="Thời gian bay"
                            value={flightData.flightDuration}
                            onChange={handleChange}
                        />
                        <span className={styles.icon}>
                            <LuClock />
                        </span>
                    </div>
                </div>

                <div className={`${styles["form-row"]} ${styles["last-row"]}`}>
                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            name="seatQuantity"
                            placeholder="Số lượng ghế hạng k"
                            value={flightData.seatQuantity}
                            onChange={handleChange}
                        />
                        <span className={styles.icon}>
                            <AiOutlineUserAdd />
                        </span>
                    </div>

                    <button type="button" className={styles["confirm-button"]}>
                        Xác nhận
                    </button>
                </div>

                <button type="submit" className={styles["submit-button"]}>
                    Thêm chuyến bay
                </button>
            </form>
        </div>
    );
}
