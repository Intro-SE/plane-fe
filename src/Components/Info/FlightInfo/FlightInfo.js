import React from "react";
import { IoPeopleOutline, IoBusinessOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuClock } from "react-icons/lu";
import styles from "./FlightInfo.module.css";
import { TbBuildingAirport } from "react-icons/tb";

export default function FlightInfo() {
    return (
        <div className={styles["flight-info-card"]}>
            <div className={styles["flight-header"]}>
                <h2>VJ-123</h2>

                <div className={styles["flight-metadata"]}>
                    <div className={styles["metadata-item"]}>
                        <MdOutlineCalendarMonth className={styles.icon} />
                        <span>31/12/2025</span>
                    </div>
                    <div className={styles["metadata-item"]}>
                        <span className={styles.icon}>
                            <IoPeopleOutline />
                        </span>
                        <span>200</span>
                    </div>
                </div>
            </div>

            <div className={styles["flight-routes"]}>
                <div className={styles["route-row"]}>
                    <div className={styles["time-column"]}>
                        <LuClock className={styles.icon} />
                        <div className={styles.time}>9:00</div>
                    </div>

                    <div className={styles["vertical-divider-container"]}>
                        <div className={styles["vertical-divider"]}></div>
                    </div>

                    <div className={styles["city-column"]}>
                        <span className={styles.icon}>
                            <IoBusinessOutline />
                        </span>
                        <div className={styles.city}>TPHCM</div>
                    </div>

                    <div className={styles["airport-column"]}>
                        <TbBuildingAirport className={styles.icon} />
                        <div className={styles.airport}>Tân Sơn Nhất</div>
                    </div>
                </div>

                <div className={styles["horizontal-divider"]}></div>

                <div className={styles["route-row"]}>
                    <div className={styles["time-column"]}>
                        <LuClock className={styles.icon} />
                        <div className={styles.time}>11:00</div>
                    </div>

                    <div className={styles["vertical-divider-container"]}>
                        <div className={styles["vertical-divider"]}></div>
                    </div>

                    <div className={styles["city-column"]}>
                        <span className={styles.icon}>
                            <IoBusinessOutline />
                        </span>
                        <div className={styles.city}>Hà Nội</div>
                    </div>

                    <div className={styles["airport-column"]}>
                        <TbBuildingAirport className={styles.icon} />
                        <div className={styles.airport}>Nội Bài</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
