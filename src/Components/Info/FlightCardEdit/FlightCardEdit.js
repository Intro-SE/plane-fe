import { MdOutlineCalendarMonth, MdClose } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import styles from "./FlightCardEdit.module.css";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function FlightCardEdit({
    data,
    onSendData,
    onFlightSelect,
    isSelected,
}) {
    const {
        flight_id,
        // flight_route_id,
        departure_date,
        total_seats,

        departure_address,
        departure_time,
        departure_airport,

        arrival_time,
        arrival_airport,
        arrival_address,

        intermediate_stops,

        seat_information,
    } = data;

    const [showModal, setShowModal] = useState(false);
    const [showModalChangeFlight, setShowModalChangeFlight] = useState(false);

    // Đóng modal khi click ra ngoài hoặc nhấn ESC
    useEffect(() => {
        if (!showModal && !showModalChangeFlight) return;

        const handleClickOutside = (e) => {
            if (e.target.classList.contains(styles["modal-overlay"])) {
                setShowModal(false);
                setShowModalChangeFlight(false);
            }
        };

        const handleEscKey = (e) => {
            if (e.key === "Escape") {
                setShowModal(false);
                setShowModalChangeFlight(false);
            }
        };

        // Add slight delay to prevent immediate closing
        const timeoutId = setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("keydown", handleEscKey);
        }, 100);

        document.body.style.overflow = "hidden";

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleEscKey);
            document.body.style.overflow = "unset";
        };
    }, [showModal, showModalChangeFlight]);

    const handleUpdate = () => {
        onSendData(data);
    };

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        onFlightSelect(flight_id, isChecked);
    };

    return (
        <div className={styles["flight-card"]}>
            <div className={styles["flight-code-section"]}>
                <div className={styles["flight-code"]}>{flight_id}</div>
                <div className={styles["flight-info-row"]}>
                    <div className={styles["flight-date"]}>
                        <MdOutlineCalendarMonth
                            className={styles["icon-small"]}
                        />
                        <span>
                            {new Date(departure_date).toLocaleDateString(
                                "vi-VN",
                            )}
                        </span>
                    </div>
                    <div className={styles["seat-count"]}>
                        <span className={styles["seat-icon"]}>
                            <GrGroup className={styles["icon-small"]} />
                        </span>
                        <span>{total_seats}</span>
                    </div>
                </div>
            </div>

            <div className={styles["divider"]}></div>

            <div className={styles["route-section"]}>
                <div className={styles["time-location-section"]}>
                    <div className={styles["time"]}>
                        {departure_time.slice(0, 5)}
                    </div>
                    <div className={styles["location"]}>
                        {departure_address}
                    </div>
                </div>

                <div className={styles["flight-path-section"]}>
                    <div className={styles["flight-path"]}>
                        <div className={styles["line"]}></div>
                    </div>
                    <div className={styles["airport-codes"]}>
                        <span
                            className={`${styles["airport-code"]} ${styles["left-code"]}`}
                        >
                            {departure_airport}
                        </span>
                        <span
                            className={`${styles["airport-code"]} ${styles["right-code"]}`}
                        >
                            {arrival_airport}
                        </span>
                    </div>
                </div>

                <div className={styles["time-location-section"]}>
                    <div className={styles["time"]}>
                        {arrival_time.slice(0, 5)}
                    </div>
                    <div className={styles["location"]}>{arrival_address}</div>
                </div>
            </div>

            <div className={styles["divider"]}></div>

            <div className={styles["seat-info-section"]}>
                <div className={styles["seat-info"]}>
                    Số ghế trống: {seat_information.empty_seats}
                </div>
                <div className={styles["seat-info"]}>
                    Số ghế đặt: {seat_information.occupied_seats}
                </div>
            </div>

            <div className={styles["divider"]}></div>

            <div className={styles["layover-section"]}>
                <div className={styles["layover-label"]}>
                    Số điểm dừng trung gian: {intermediate_stops.length}
                </div>
                <div
                    className={styles["layover-detail"]}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowModal(true);
                    }}
                >
                    Xem chi tiết
                </div>
            </div>
            {showModal &&
                createPortal(
                    <div className={styles["modal-overlay"]}>
                        <div
                            className={styles["modal-content"]}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles["modal-header"]}>
                                <h3>
                                    Thông tin chi tiết chuyến bay {flight_id}
                                </h3>
                                <button
                                    className={styles["close-button"]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModal(false);
                                    }}
                                    aria-label="Đóng modal"
                                >
                                    <MdClose />
                                </button>
                            </div>

                            {/* Bảng các sân bay trung gian */}
                            <h4>Các sân bay trung gian</h4>
                            <table className={styles["modal-table"]}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Sân bay trung gian</th>
                                        <th>Thời gian dừng</th>
                                        <th>Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {intermediate_stops.map((item, index) => (
                                        <tr key={index}>
                                            {/* <td>{index + 1}</td> */}
                                            <td>{item.stop_number}</td>
                                            <td>{item.stop_name}</td>
                                            <td>{item.stop_time}</td>
                                            <td>{item.note}</td>
                                        </tr>
                                    ))}
                                    {/* Bạn có thể thêm dòng khác */}
                                </tbody>
                            </table>

                            {/* Bảng các hạng vé */}
                            <h4>Các hạng vé của máy bay</h4>
                            <table className={styles["modal-table"]}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Hạng vé</th>
                                        <th>Giá tiền (VNĐ)</th>
                                        <th>Số ghế còn trống</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {seat_information.seat_type.map(
                                        (type, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{type}</td>
                                                <td>
                                                    {
                                                        seat_information
                                                            .seat_price[index]
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        seat_information
                                                            .empty_type_seats[
                                                            index
                                                        ]
                                                    }
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                    {/* Thêm dòng khác nếu cần */}
                                </tbody>
                            </table>
                        </div>
                    </div>,
                    document.body,
                )}
            <div className={styles["divider"]}></div>

            <div className={styles["action-section"]}>
                <button
                    className={styles["edit-button"]}
                    onClick={handleUpdate}
                >
                    <FaEdit style={{ marginRight: "6px" }} />
                    Sửa
                </button>
                <div className={styles["action-row"]}>
                    Xoá
                    <input
                        type="checkbox"
                        id={`delete-checkbox-${flight_id}`}
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                    />
                </div>
            </div>
        </div>
    );
}
