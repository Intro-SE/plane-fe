import React, { useState } from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuClock } from "react-icons/lu";
import "./FlightTicketEdit.css";

export default function FlightTicketEdit() {
    const [editChecked, setEditChecked] = useState(false);
    const [cancelChecked, setCancelChecked] = useState(false);

    return (
        <div className="ticket-container">
            <div className="ticket-header">
                <div className="ticket-info">
                    <div className="ticket-id">Mã chuyến bay: VJ-123</div>
                    <div className="separator"></div>
                    <div className="ticket-route">Tuyến bay: TPHCM→ Hà Nội</div>
                    <div className="separator"></div>
                    <div className="ticket-code">Mã vé: #ABC</div>
                </div>
                <div className="action-buttons">
                    <label className="action-btn">
                        <span>Sửa vé</span>
                        <input
                            type="checkbox"
                            checked={editChecked}
                            onChange={() => setEditChecked(!editChecked)}
                        />
                        <div className="checkmark"></div>
                    </label>
                    <label className="action-btn">
                        <span>Hủy vé</span>
                        <input
                            type="checkbox"
                            checked={cancelChecked}
                            onChange={() => setCancelChecked(!cancelChecked)}
                        />
                        <div className="checkmark"></div>
                    </label>
                </div>
            </div>
            <div className="ticket-body">
                <div className="passenger-info">
                    <div className="passenger-details">
                        <div className="passenger-name">
                            <span>Họ tên:</span> Nguyễn Tấn Hưng
                        </div>
                        <p>SĐT: 0123456789</p>
                        <p>CCCD: 0xxx-xxxx-xxxx</p>
                    </div>
                </div>
                <div className="departure-info">
                    <div className="airport-name">Tân Sơn Nhất</div>
                    <div className="info-row">
                        <div className="icon-wrapper">
                            <MdOutlineCalendarMonth />
                        </div>
                        <div>31/12/2025</div>
                    </div>
                    <div className="info-row">
                        <div className="icon-wrapper">
                            <LuClock />
                        </div>
                        <div>9:00</div>
                    </div>
                </div>
                <div className="arrival-info">
                    <div className="airport-name">Nội Bài</div>
                    <div className="info-row">
                        <div className="icon-wrapper">
                            <MdOutlineCalendarMonth />
                        </div>
                        <div>31/12/2025</div>
                    </div>
                    <div className="info-row">
                        <div className="icon-wrapper">
                            <LuClock />
                        </div>
                        <div>15:00</div>
                    </div>
                </div>
                <div className="price-info">
                    <div>
                        <div>Giá tiền</div>
                        <div className="price">9.999.999 VND</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
