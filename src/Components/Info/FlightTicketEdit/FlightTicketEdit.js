import React, { useState } from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuClock } from "react-icons/lu";
import styles from "./FlightTicketEdit.module.css";

export default function FlightTicketEdit() {
    const [editChecked, setEditChecked] = useState(false);
    const [cancelChecked, setCancelChecked] = useState(false);

    return (
        <div className={styles["ticket-container"]}>
            <div className={styles["ticket-header"]}>
                <div className={styles["ticket-info"]}>
                    <div className={styles["ticket-id"]}>
                        Mã chuyến bay: VJ-123
                    </div>
                    <div className={styles["separator"]}></div>
                    <div className={styles["ticket-route"]}>
                        Tuyến bay: TPHCM→ Hà Nội
                    </div>
                    <div className={styles["separator"]}></div>
                    <div className={styles["ticket-code"]}>Mã vé: #ABC</div>
                </div>
                <div className={styles["action-buttons"]}>
                    <label className={styles["action-btn"]}>
                        <span>Sửa vé</span>
                        <input
                            type="checkbox"
                            checked={editChecked}
                            onChange={() => setEditChecked(!editChecked)}
                        />
                        <div className={styles["checkmark"]}></div>
                    </label>
                    <label className={styles["action-btn"]}>
                        <span>Hủy vé</span>
                        <input
                            type="checkbox"
                            checked={cancelChecked}
                            onChange={() => setCancelChecked(!cancelChecked)}
                        />
                        <div className={styles["checkmark"]}></div>
                    </label>
                </div>
            </div>
            <div className={styles["ticket-body"]}>
                <div className={styles["passenger-info"]}>
                    <div className={styles["passenger-details"]}>
                        <div className={styles["passenger-name"]}>
                            <span>Họ tên:</span> Nguyễn Tấn Hưng
                        </div>
                        <p>SĐT: 0123456789</p>
                        <p>CCCD: 0xxx-xxxx-xxxx</p>
                    </div>
                </div>
                <div className={styles["departure-info"]}>
                    <div className={styles["airport-name"]}>Tân Sơn Nhất</div>
                    <div className={styles["info-row"]}>
                        <div className={styles["icon-wrapper"]}>
                            <MdOutlineCalendarMonth />
                        </div>
                        <div>31/12/2025</div>
                    </div>
                    <div className={styles["info-row"]}>
                        <div className={styles["icon-wrapper"]}>
                            <LuClock />
                        </div>
                        <div>9:00</div>
                    </div>
                </div>
                <div className={styles["arrival-info"]}>
                    <div className={styles["airport-name"]}>Nội Bài</div>
                    <div className={styles["info-row"]}>
                        <div className={styles["icon-wrapper"]}>
                            <MdOutlineCalendarMonth />
                        </div>
                        <div>31/12/2025</div>
                    </div>
                    <div className={styles["info-row"]}>
                        <div className={styles["icon-wrapper"]}>
                            <LuClock />
                        </div>
                        <div>15:00</div>
                    </div>
                </div>
                <div className={styles["price-info"]}>
                    <div>
                        <div>Giá tiền</div>
                        <div className={styles["price"]}>9.999.999 VND</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
