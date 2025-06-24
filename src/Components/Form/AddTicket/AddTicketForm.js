import React, { useState } from "react";
import { Plane, HelpCircle } from "lucide-react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import styles from "./AddTicketForm.module.css";
import ConfirmDialog from "../../Dialog/Confirm/ConfirmDialog";
import axios from "axios";
import { BASE_URL } from "../../../Pages/api";

import { useEffect } from "react";

export default function AddTicketForm({
  onClose,
  onSendData,
  defaultData = {},
  mode = "add",
}) {
  const [seatClassData, setSeatClassData] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [handleConfirm, setHandleConfirm] = useState(() => () => {});
  const [formData, setFormData] = useState({
    flightCode: "",
    fullName: "",
    passengerId: "",
    numberPhone: "",
    gender: "",
    seatType: "",
    ticketPrice: 0,
    employee_id: "",
    ...defaultData,
  });

  useEffect(() => {
    if (mode === "edit" && defaultData) {
      setFormData((prev) => ({
        ...prev,
        flightCode: defaultData.flight_id || "",
        fullName: defaultData.passenger_name || "",
        passengerId: defaultData.national_id || "",
        numberPhone: defaultData.passenger_phone || "",
        gender: defaultData.passenger_gender || "",
        seatType: defaultData.ticket_class_id || "",
        ticketPrice: defaultData.booking_price || 0,
        booking_ticket_id: defaultData.booking_ticket_id || "",
      }));

      // ✅ GỌI API để load danh sách hạng vé tương ứng với chuyến bay
      if (defaultData.flight_id) {
        fetchSeatClass(defaultData.flight_id);
      }
    }
  }, [defaultData, mode]);

  useEffect(() => {
    if (mode === "edit" && seatClassData.length > 0 && formData.seatType) {
      const selected = seatClassData.find(
        (s) => s.ticket_class_id === formData.seatType
      );
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          ticketPrice: selected.price || 0,
        }));
      }
    }
  }, [seatClassData, formData.seatType, mode]);

  useEffect(() => {
    const storedEmployee = JSON.parse(localStorage.getItem("employee"));
    if (storedEmployee?.employee_id) {
      setFormData((prev) => ({
        ...prev,
        employee_id: storedEmployee.employee_id,
      }));
    }
  }, []);

  const fetchSeatClass = async (flightCode) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/flight_management/ticketclass?flight_id=${flightCode}`,
        { headers: { Accept: "application/json" } }
      );
      setSeatClassData(response.data);
    } catch (err) {
      console.error("Không thể lấy dữ liệu hạng vé:", err);
      setSeatClassData([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const confirmCreate = async () => {
    const selectedSeat = seatClassData.find(
      (s) => s.ticket_class_id === formData.seatType
    );

    const finalData = {
      flight_id: formData.flightCode,
      passenger_name: formData.fullName,
      national_id: formData.passengerId,
      passenger_gender: formData.gender,
      passenger_phone: formData.numberPhone,
      ticket_class_id: formData.seatType,
      ticket_class_name: selectedSeat?.ticket_class_name || "",
      booking_price: Number(formData.ticketPrice),
      employee_id: formData.employee_id,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/booking_management/create`,
        finalData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // ✅ Cập nhật lại booking_ticket_id từ phản hồi
      const newTicket = response.data;
      const enrichedData = {
        ...finalData,
        booking_ticket_id: newTicket.booking_ticket_id,
      };

      onClose();
      onSendData(enrichedData); // Gửi cả booking_ticket_id ra ngoài
    } catch (error) {
      console.error("Lỗi khi tạo vé:", error.response?.data || error.message);
      alert("Không thể tạo vé. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const confirmUpdate = async () => {
    const selectedSeat = seatClassData.find(
      (s) => s.ticket_class_id === formData.seatType
    );

    const finalData = {
      flight_id: formData.flightCode,
      booking_ticket_id: formData.booking_ticket_id,
      passenger_name: formData.fullName,
      national_id: formData.passengerId,
      passenger_gender: formData.gender,
      passenger_phone: formData.numberPhone,
      ticket_class_id: formData.seatType,
      ticket_class_name: selectedSeat?.ticket_class_name || "",
      booking_price: Number(formData.ticketPrice),
      employee_id: formData.employee_id,
    };

    try {
      console.log("Dữ liệu gửi đi (update):", finalData);
      await axios.put(
        `${BASE_URL}/api/v1/booking_management/update`,
        finalData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      onClose();
      onSendData(finalData);
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật vé:",
        error.response?.data || error.message
      );
      alert("Không thể cập nhật vé. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleSave = () => {
    if (mode === "edit") {
      setHandleConfirm(() => () => {
        setShowConfirmDialog(false);
        confirmUpdate();
      });
      setShowConfirmDialog(true);
    } else {
      confirmCreate(); // ✅ dùng hàm riêng cho tạo mới
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>THÔNG TIN HÀNH KHÁCH</h3>
        </div>

        <hr />

        <div className={styles.form}>
          {/* Row 1 */}
          <div className={`${styles.row} ${styles.row1}`}>
            <div className={styles.inputGroup}>
              <label>Mã chuyến bay</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="VJ-123"
                  value={formData.flightCode}
                  onChange={(e) =>
                    handleInputChange("flightCode", e.target.value)
                  }
                  onBlur={(e) => fetchSeatClass(e.target.value)} // Gọi API khi rời ôs
                />
                <Plane size={16} className={styles.icon} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Họ và tên</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="NGUYỄN VĂN A"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                />
                <HelpCircle size={16} className={styles.icon} />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className={`${styles.row} ${styles.row2}`}>
            <div className={styles.inputGroup}>
              <label>CMND/CCCD</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="0xxx-xxxx-xxx"
                  value={formData.passengerId}
                  onChange={(e) =>
                    handleInputChange("passengerId", e.target.value)
                  }
                />
                <FaRegIdCard size={16} className={styles.icon} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Số điện thoại</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="09xx-xxx-xxx"
                  value={formData.numberPhone}
                  onChange={(e) =>
                    handleInputChange("numberPhone", e.target.value)
                  }
                />
                <FiPhone size={16} className={styles.icon} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Giới tính</label>
              <div className={styles.genderBox}>
                <div className={styles.genderGroup}>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Nam"
                      checked={formData.gender === "Nam"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    />
                    Nam
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={formData.gender === "Nữ"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    />
                    Nữ
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className={`${styles.row} ${styles.row3}`}>
            <div className={styles.inputGroup}>
              <label>Hạng vé</label>
              <select
                className={styles.input}
                value={formData.seatType}
                onChange={(e) => {
                  const selected = seatClassData.find(
                    (s) => s.ticket_class_id === e.target.value
                  );
                  handleInputChange("seatType", e.target.value);
                  handleInputChange("ticketPrice", selected?.price || 0);
                }}
              >
                <option value="">Chọn hạng</option>
                {seatClassData.map((type) => (
                  <option
                    key={type.ticket_class_id}
                    value={type.ticket_class_id}
                  >
                    {type.ticket_class_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Giá tiền</label>
              <div className={styles.input} style={{ lineHeight: "20px" }}>
                {formData.ticketPrice
                  ? formData.ticketPrice.toLocaleString("vi-VN") + " VND"
                  : "0 VND"}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.cancelButton} onClick={onClose}>
                Hủy
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                {mode === "add" ? "Lưu" : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showConfirmDialog && (
        <ConfirmDialog
          open={showConfirmDialog}
          message="Bạn chắc chắn muốn lưu thay đổi của phiếu đặt chỗ này đúng không?"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </>
  );
}
