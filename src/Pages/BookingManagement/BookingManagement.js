import SideBar from "../../Components/SideBar/SideBar.js";
import TicketFilter from "../../Components/Filter/Ticket/TicketFilter";
import BookingFlightTicket from "../../Components/Info/BookingFlightTicket/BookingFlightTicket";
import TopBar from "../../Components/TopBar/TopBar";

import AddTicketForm from "../../Components/Form/AddTicket/AddTicketForm";
import ConfirmDialog from "../../Components/Dialog/Confirm/ConfirmDialog";
import MessageDialog from "../../Components/Dialog/Message/MessageDialog";

import styles from "./BookingManagement.module.css";
import axios from "axios";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Trash2, FileOutput } from "lucide-react";

import { BASE_URL } from "../api.js";

export default function BookingManagement() {
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({ mode: null, data: null });
  const [detailData, setDetailData] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [handleConfirm, setHandleConfirm] = useState(() => () => {});
  const [handleCancel, setHandleCancel] = useState(() => () => {});
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/booking_management/tickets`,
          { headers: { Accept: "application/json" } }
        );
        setTickets(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy vé:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [reloadFlag]);

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      const idA =
        parseInt((a.booking_ticket_id || "").replace(/\D/g, ""), 10) || 0;
      const idB =
        parseInt((b.booking_ticket_id || "").replace(/\D/g, ""), 10) || 0;
      return idA - idB;
    });
  }, [tickets]);

  const handleFilter = async (filterData) => {
    setLoading(true);
    try {
      const payload = {
        departure_address: filterData.departure_address,
        arrival_address: filterData.arrival_address,
        booking_ticket_id: filterData.booking_ticket_id,
        ticket_class_name: filterData.ticket_class_name,
        departure_date: filterData.departure_date || null,
        flight_id: filterData.flight_id,
        min_price: filterData.min_price || 0,
        max_price: filterData.max_price || 0,
        passenger_name: filterData.passenger_name,
        national_id: filterData.national_id,
        passenger_phone: filterData.passenger_phone,
      };

      const res = await axios.post(
        `${BASE_URL}/api/v1/booking_management/search_by_filters`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setTickets(res.data);
    } catch (err) {
      console.error("Lỗi filter:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmExport = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/v1/booking_management/export`,
        selectedTickets,
        { headers: { "Content-Type": "application/json" } }
      );
      setToast({
        show: true,
        type: "success",
        message: `Xuất thành công ${selectedTickets.length} vé!`,
      });
      setReloadFlag((f) => f + 1);
      setSelectedTickets([]);
    } catch (err) {
      console.error("Lỗi xuất vé:", err.response?.data || err.message);
      setToast({
        show: true,
        type: "error",
        message: "Xuất vé không thành công!",
      });
    } finally {
      setIsDialogOpen(false); // đóng dialog xác nhận
    }
  };

  const handleExportTickets = () => {
    if (selectedTickets.length === 0) {
      return setToast({
        show: true,
        type: "error",
        message: "Chưa chọn vé để xuất!",
      });
    }

    setMessage(
      `Bạn chắc chắn muốn xuất ${selectedTickets.length} phiếu đặt chỗ này đúng không?`
    );
    setHandleConfirm(() => confirmExport);
    setHandleCancel(() => () => setIsDialogOpen(false));
    setIsDialogOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedTickets.length === 0) {
      return setToast({
        show: true,
        type: "error",
        message: "Chưa chọn vé để xóa!",
      });
    }

    const confirmDelete = async () => {
      try {
        await axios.delete(`${BASE_URL}/api/v1/booking_management/delete`, {
          data: selectedTickets,
          headers: { "Content-Type": "application/json" },
        });
        setToast({ show: true, type: "success", message: "Xóa thành công!" });
        setReloadFlag((f) => f + 1);
      } catch (err) {
        console.error("Lỗi xóa:", err.response?.data || err.message);
        setToast({ show: true, type: "error", message: "Xóa thất bại!" });
      } finally {
        setSelectedTickets([]);
        setIsDialogOpen(false);
      }
    };

    setMessage(`Bạn chắc chắn muốn xóa ${selectedTickets.length} phiếu?`);
    setHandleConfirm(() => confirmDelete);
    setHandleCancel(() => () => setIsDialogOpen(false));
    setIsDialogOpen(true);
  };

  const handleOpenAddTicketForm = () => {
    console.log("[DEBUG] gọi form add");
    setFormState({ mode: "add", data: null });
  };
  const handleOpenUpdateTicketForm = (data) =>
    setFormState({ mode: "edit", data });

  const handleCloseDetail = () => setDetailData(null);

  const handleTicketSelect = (id, selected) => {
    setSelectedTickets((prev) =>
      selected ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  useEffect(() => {
    if (!detailData) return;

    const handleClickOutside = (e) => {
      if (e.target.classList.contains(styles["overlay"])) {
        setDetailData(null);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setDetailData(null);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [detailData]);

  return (
    <div className={styles["overral-page-container"]}>
      <TopBar />
      <div className={styles["booking-management"]}>
        <div className={styles["sidebar-container"]}>
          <SideBar />
        </div>
        <div className={styles["content-container"]}>
          <div className={styles["filter-container"]}>
            <TicketFilter onSendData={handleFilter} />
          </div>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                Danh sách các phiếu đặt chỗ
                <span className={styles["ticket-count"]}>{tickets.length}</span>
              </h1>
              <div className={styles.actions}>
                <button
                  onClick={handleOpenAddTicketForm}
                  className={styles.button}
                >
                  <Plus size={16} className={styles.icon} />
                  Tạo phiếu
                </button>
                <button
                  onClick={handleExportTickets}
                  className={`${styles.button} ${
                    selectedTickets.length > 0 ? styles["delete-active"] : ""
                  }`}
                  disabled={selectedTickets.length === 0}
                >
                  <FileOutput size={16} className={styles.icon} />
                  Xuất vé ({selectedTickets.length})
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className={`${styles.button} ${
                    selectedTickets.length > 0 ? styles["delete-active"] : ""
                  }`}
                  disabled={selectedTickets.length === 0}
                >
                  <Trash2 size={16} className={styles.icon} />
                  Xóa ({selectedTickets.length})
                </button>
              </div>
            </div>
          </div>

          {formState.mode && (
            <div className={styles.overlay}>
              <div className={styles.modal}>
                <AddTicketForm
                  mode={formState.mode}
                  defaultData={formState.data}
                  onClose={() => setFormState({ mode: null, data: null })}
                  onSendData={
                    formState.mode === "add"
                      ? () => setReloadFlag((f) => f + 1)
                      : () => setReloadFlag((f) => f + 1)
                  }
                />
              </div>
            </div>
          )}

          {isDialogOpen && (
            <ConfirmDialog
              open={isDialogOpen}
              message={message}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          )}

          <MessageDialog
            show={toast.show}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          />

          <div className={styles["ticket-container"]}>
            {loading ? (
              <p>Loading tickets...</p>
            ) : (
              sortedTickets.map((ticket) => (
                <BookingFlightTicket
                  key={ticket.booking_ticket_id}
                  data={ticket}
                  onEdit={() => handleOpenUpdateTicketForm(ticket)}
                  onTicketSelect={handleTicketSelect}
                  isSelected={selectedTickets.includes(
                    ticket.booking_ticket_id
                  )}
                  onViewDetail={() => setDetailData(ticket)} // thêm dòng này
                />
              ))
            )}
          </div>
        </div>
      </div>
      {detailData && (
        <div className={styles.overlay}>
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["modal-header"]}>
              <h2>Thông tin chi tiết</h2>
              <button
                className={styles["close-button"]}
                onClick={handleCloseDetail}
              >
                ✕
              </button>
            </div>

            <div className={styles["modal-section"]}>
              <h3>Thông tin phiếu vé</h3>
              <table className={styles["modal-table"]}>
                <tbody>
                  <tr>
                    <td>Mã vé:</td>
                    <td>{detailData.booking_ticket_id}</td>
                    <td>Ngày đặt:</td>
                    <td>
                      {new Date(
                        detailData.created_at || new Date()
                      ).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                  <tr>
                    <td>Ngày bay:</td>
                    <td>{detailData.departure_date}</td>
                    <td>Giờ bay:</td>
                    <td>{detailData.departure_time}</td>
                  </tr>
                  <tr>
                    <td>Sân bay đi:</td>
                    <td>{detailData.departure_airport}</td>
                    <td>Sân bay đến:</td>
                    <td>{detailData.arrival_airport}</td>
                  </tr>
                  <tr>
                    <td>Hạng vé:</td>
                    <td>{detailData.ticket_class_name}</td>
                    <td>Giá tiền:</td>
                    <td>
                      {detailData.ticket_price?.toLocaleString("vi-VN")} VND
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles["modal-section"]}>
              <h3>Thông tin khách hàng</h3>
              <table className={styles["modal-table"]}>
                <tbody>
                  <tr>
                    <td>Họ tên:</td>
                    <td>{detailData.passenger_name}</td>
                    <td>CCCD/CMND:</td>
                    <td>{detailData.national_id}</td>
                  </tr>
                  <tr>
                    <td>SĐT:</td>
                    <td>{detailData.passenger_phone}</td>
                    <td>Giới tính:</td>
                    <td>{detailData.passenger_gender}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles["modal-section"]}>
              <h3>Thông tin nhân viên</h3>
              <table className={styles["modal-table"]}>
                <tbody>
                  <tr>
                    <td>Mã NV:</td>
                    <td>{detailData.employee_id}</td>
                    <td>Tên NV:</td>
                    <td>{detailData.employee_name || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
