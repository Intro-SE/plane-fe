// File: BookingFlightTicket.js

import React from "react";
import { useState } from "react"; // bạn đã quên import useState
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuClock, LuPencil } from "react-icons/lu";
import { TbBuildingAirport } from "react-icons/tb";
import styles from "./FlightTicket.module.css";
import AddTicketForm from "../../Form/AddTicket/AddTicketForm";

// FIX: Chỉ cần 4 props chính
export default function FlightTicket({
  data,
  onEdit,
  onTicketSelect,
  isSelected,
  onViewDetail,
}) {
  const {
    booking_ticket_id,
    flight_id,
    flight_route_id,
    departure_date,
    arrival_date,
    departure_time,
    departure_name,
    arrival_time,
    arrival_name,
    passenger_name,
    national_id,
    passenger_phone,
    ticket_class_name,
    ticket_price,
  } = data;

  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const formatCurrency = (price) => {
    if (price === null || price === undefined) return "N/A";
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleSelectChange = (e) => {
    e.stopPropagation();
    onTicketSelect(booking_ticket_id, e.target.checked);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(); // ✅ Gửi lệnh sửa lên cha, không truyền thêm mode gì ở đây
  };

  return (
    <div
      className={`${styles["ticket-container"]} ${
        isSelected ? styles["selected"] : ""
      }`}
    >
      <div className={styles["ticket-header"]}>
        <div className={styles["ticket-info"]}>
          <div className={styles["ticket-id"]}>Mã chuyến bay: {flight_id}</div>
          <div className={styles["separator"]}></div>
          <div className={styles["ticket-route"]}>
            Mã tuyến bay: {flight_route_id}
          </div>
          <div className={styles["separator"]}></div>
          <div className={styles["ticket-code"]}>
            Hạng vé: {ticket_class_name}
          </div>
        </div>
        <div className={styles["action-buttons"]}>
          <button className={styles["edit-btn"]} onClick={handleEditClick}>
            <LuPencil size={14} />
            <span>Sửa vé</span>
          </button>

          {/* FIX: Chỉ giữ lại MỘT checkbox duy nhất để chọn vé */}
          <label className={styles["action-btn"]}>
            <span>Chọn</span>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleSelectChange}
            />
            <div className={styles["checkmark"]}></div>
          </label>
        </div>
      </div>
      <div className={styles["ticket-body"]}>
        <div className={styles["passenger-info"]}>
          <div className={styles["passenger-details"]}>
            <div className={styles["passenger-name"]}>
              <span>Họ tên:</span> {passenger_name}
            </div>
            <p>SĐT: {passenger_phone}</p>
            <p>CCCD: {national_id}</p>
          </div>
        </div>
        <div className={styles["departure-info"]}>
          <div className={styles["info-row"]}>
            <div className={styles["icon-wrapper"]}>
              <TbBuildingAirport />
            </div>
            <div>{departure_name}</div>
          </div>
          <div className={styles["info-row"]}>
            <div className={styles["icon-wrapper"]}>
              <MdOutlineCalendarMonth />
            </div>
            <div>{departure_date}</div>
          </div>
          <div className={styles["info-row"]}>
            <div className={styles["icon-wrapper"]}>
              <LuClock />
            </div>
            <div>{departure_time}</div>
          </div>
        </div>
        <div className={styles["arrival-info"]}>
          <div className={styles["info-row"]}>
            <div className={styles["icon-wrapper"]}>
              <TbBuildingAirport />
            </div>
            <div>{arrival_name}</div>
          </div>
          <div className={styles["info-row"]}>
            <div className={styles["icon-wrapper"]}>
              <MdOutlineCalendarMonth />
            </div>
            <div>{arrival_date}</div>
          </div>
          <div className={styles["info-row"]}>
            <div className={styles["icon-wrapper"]}>
              <LuClock />
            </div>
            <div>{arrival_time}</div>
          </div>
        </div>
        <div className={styles["price-info"]}>
          <div>
            <div>Giá tiền</div>
            <div className={styles["price"]}>
              {formatCurrency(ticket_price)}
            </div>
            <div className={styles["view-detail"]} onClick={onViewDetail}>
              Xem chi tiết
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
