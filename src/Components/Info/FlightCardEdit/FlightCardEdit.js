import React from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import styles from "./FlightCardEdit.module.css";
import { useState, useEffect } from "react";

export default function FlightCardEdit({ data }) {
  const {
    flight_id,
    departure_date,
    total_seats,

    departure_time,
    departure_airport,
    departure_address,

    arrival_time,
    arrival_airport,
    arrival_address,

    intermediate_stops,

    seat_information,
  } = data;

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModalChangeFlight, setShowModalChangeFlight] = useState(false);

  // Đóng modal khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(styles["modal-overlay"])) {
        setShowModal(false);
        setShowModalChangeFlight(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <div className={styles["flight-card"]}>
      <div className={styles["flight-code-section"]}>
        <div className={styles["flight-code"]}>{flight_id}</div>
        <div className={styles["flight-info-row"]}>
          <div className={styles["flight-date"]}>
            <MdOutlineCalendarMonth className={styles["icon-small"]} />
            <span>{departure_date}</span>
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
          <div className={styles["time"]}>{departure_time}</div>
          <div className={styles["location"]}>{departure_address}</div>
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
          <div className={styles["time"]}>{arrival_time}</div>
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
          onClick={() => setShowModal(true)}
        >
          Xem chi tiết
        </div>
      </div>
      {showModal && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <h3>Thông tin chi tiết</h3>

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
                    <td>{index + 1}</td>
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
                {seat_information.seat_type.map((type, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{type}</td>
                    <td>{seat_information.seat_price[index]}</td>
                    <td>{seat_information.empty_type_seats[index]}</td>
                  </tr>
                ))}
                {/* Thêm dòng khác nếu cần */}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className={styles["divider"]}></div>

      <div className={styles["action-section"]}>
        <button className={styles["edit-button"]}>
          <FaEdit style={{ marginRight: "6px" }} />
          Sửa
        </button>
        <div className={styles["action-row"]}>
          {/* <FiTrash2 className={styles["action-icon"]} /> */}
          Xoá
          <input type="checkbox" id="delete-checkbox" />
        </div>
      </div>
    </div>
  );
}
