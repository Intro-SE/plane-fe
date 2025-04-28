import React from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import styles from "./FlightCard.module.css";

export default function FlightCard() {
    return (
        <div className={styles["flight-booking"]}>
            {/* Flight Code & Info Section */}
            <div className={styles["flight-code-section"]}>
                <div className={styles["flight-code"]}>VJ-123</div>
                <div className={styles["flight-info-row"]}>
                    <div className={styles["flight-date"]}>
                        <MdOutlineCalendarMonth
                            className={styles["icon-small"]}
                        />
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

            {/* Layover Information */}
            <div className={styles["layover-section"]}>
                <div className={styles["layover-label"]}>
                    Số điểm dừng trung gian: 1
                </div>
                <div className={styles["layover-detail"]}>Xem chi tiết</div>
            </div>

            {/* Vertical divider */}
            <div className={styles["divider"]}></div>

            {/* Seat Information */}
            <div className={styles["seat-info-section"]}>
                <div className={styles["seat-info"]}>Số ghế trống: 170</div>
                <div className={styles["seat-info"]}>Số ghế đặt: 100</div>
            </div>
        </div>
    );
}
