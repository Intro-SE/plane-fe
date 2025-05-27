import React from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import styles from "./FlightCard.module.css";
import { useState, useEffect } from "react";

export default function FlightCard() {
  const [showModal, setShowModal] = useState(false);

  // Đóng modal khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(styles["modal-overlay"])) {
        setShowModal(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <div className={styles["flight-booking"]}>
      {/* Flight Code & Info Section */}
      <div className={styles["flight-code-section"]}>
        <div className={styles["flight-code"]}>VJ-123</div>
        <div className={styles["flight-info-row"]}>
          <div className={styles["flight-date"]}>
            <MdOutlineCalendarMonth className={styles["icon-small"]} />
            <span>01-01-2025</span>
          </div>
          <div className={styles["seat-count"]}>
            <span className={styles["seat-icon"]}>
              <GrGroup className={styles["icon-small"]} />
            </span>
            <span>170</span>
          </div>
        </div>
      </div>

      {/* Vertical divider */}
      <div className={styles["divider"]}></div>

      {/* Flight Path Section */}
      <div className={styles["route-section"]}>
        {/* Departure */}
        <div className={styles["time-location-section"]}>
          <div className={styles["time"]}>10:00</div>
          <div className={styles["location"]}>Sài Gòn</div>
        </div>

        {/* Flight Path Visualization */}
        <div className={styles["flight-path-section"]}>
          <div className={styles["flight-path"]}>
            <div className={styles["line"]}></div>
          </div>
          <div className={styles["airport-codes"]}>
            <span
              className={`${styles["airport-code"]} ${styles["left-code"]}`}
            >
              TSN
            </span>
            <span
              className={`${styles["airport-code"]} ${styles["right-code"]}`}
            >
              NB
            </span>
          </div>
        </div>

        {/* Arrival */}
        <div className={styles["time-location-section"]}>
          <div className={styles["time"]}>12:00</div>
          <div className={styles["location"]}>Hà Nội</div>
        </div>
      </div>

      {/* Vertical divider */}
      <div className={styles["divider"]}></div>

      {/* Seat Information */}
      <div className={styles["seat-info-section"]}>
        <div className={styles["seat-info"]}>Số ghế trống: 170</div>
        <div className={styles["seat-info"]}>Số ghế đặt: 100</div>
      </div>

      {/* Vertical divider */}
      <div className={styles["divider"]}></div>

      {/* Layover Information */}
      <div className={styles["layover-section"]}>
        <div className={styles["layover-label"]}>
          Số điểm dừng trung gian: 1
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
                <tr>
                  <td>1</td>
                  <td>Đà Nẵng</td>
                  <td>1 giờ</td>
                  <td>Đổi máy bay</td>
                </tr>
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
                <tr>
                  <td>1</td>
                  <td>Phổ thông</td>
                  <td>1,200,000</td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Thương gia</td>
                  <td>3,000,000</td>
                  <td>20</td>
                </tr>
                {/* Thêm dòng khác nếu cần */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
