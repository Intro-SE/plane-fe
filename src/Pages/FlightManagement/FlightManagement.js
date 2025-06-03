import SideBar from "../../Components/SideBar/SideBar.js";
import ManageFilter from "../../Components/Filter/Manage/ManageFilter";
import FlightCardEdit from "../../Components/Info/FlightCardEdit/FlightCardEdit";
import styles from "./FlightManagement.module.css";
import TopBar from "../../Components/TopBar/TopBar";
import { FaPlus } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { IoTicketOutline } from "react-icons/io5";
import { TbBuildingAirport } from "react-icons/tb";
import { TbCalendarClock } from "react-icons/tb";
import { FiClock } from "react-icons/fi";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { MdOutlineEventSeat } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { RiListSettingsLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";
import { FaPlusSquare } from "react-icons/fa";

export default function FlightManagement() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/flight/?skip=0&limit=100",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // ✅ QUAN TRỌNG
            },
          }
        ); // Thay URL phù hợp

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setFlights(result);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vé:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const [showModalAddFlights, setShowModalAddFlights] = useState(false);
  const routes = ["ABC", "ABD", "ACD", "XYZ"];
  const seatOptions = ["Phổ thông", "Thương gia", "Nhất", "Cao cấp"];
  const [selectedRoute, setSelectedRoute] = useState("");

  const [ticketRows, setTicketRows] = useState([
    { seatClass: "", quantity: "", isAdded: false },
  ]);

  const handleToggleRow = (index) => {
    setTicketRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, isAdded: !row.isAdded } : row
      )
    );
  };

  const handleAddRow = () => {
    setTicketRows((prevRows) => [
      ...prevRows,
      { seatClass: "", quantity: "", isAdded: false },
    ]);
  };

  // Đóng modal khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(styles["modal-overlay"])) {
        setShowModalAddFlights(false);

        setTicketRows([{ seatClass: "", quantity: "", isAdded: false }]);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <div className={styles["overral-page-container"]}>
      <TopBar />
      <div className={styles["flight-management-container"]}>
        <div className={styles["sidebar-container"]}>
          <SideBar />
        </div>
        <div className={styles["content-container"]}>
          <div className={styles["filter-container"]}>
            <ManageFilter />
          </div>

          {/* Add the heading and buttons section */}
          <div className={styles["action-section"]}>
            <div className={styles["section-title"]}>
              Danh sách các chuyến bay dựa theo bộ lọc
            </div>
            <div className={styles["action-buttons"]}>
              <button
                className={`${styles["action-button"]} ${styles["add-button"]}`}
                onClick={() => setShowModalAddFlights(true)}
              >
                <FaPlus style={{ marginRight: "5px" }} /> Thêm chuyến bay
              </button>
              {showModalAddFlights && (
                <div className={styles["modal-overlay"]}>
                  <div className={styles["modal-content"]}>
                    <h3>Biểu mẫu thêm một chuyến bay mới</h3>

                    {/* Nhập các thông tin gồm Mã chuyến bay, mã tuyến bay, sân bay đi, sân bay đến, ngày bay, thời gian bay, số lượng ghế */}
                    <div className={styles["input-area"]}>
                      <div className={styles["flight-id-input"]}>
                        <input type="text" placeholder="Mã chuyến bay" />
                        <IoTicketOutline className={styles["flight-id-icon"]} />
                      </div>
                      <div className={styles["route-id-input"]}>
                        <select
                          value={selectedRoute}
                          onChange={(e) => setSelectedRoute(e.target.value)}
                        >
                          <option value="" disabled hidden>
                            Mã tuyến bay
                          </option>
                          {routes.map((route) => (
                            <option key={route} value={route}>
                              {route}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles["departure-input"]}>
                        <input type="text" placeholder="Sân bay đi" disabled />
                        <TbBuildingAirport
                          className={styles["departure-icon"]}
                        />
                      </div>
                      <div className={styles["arrival-input"]}>
                        <input type="text" placeholder="Sân bay đến" disabled />
                        <TbBuildingAirport className={styles["arrival-icon"]} />
                      </div>
                      <div className={styles["departure-date-input"]}>
                        <input
                          type="text"
                          placeholder="Ngày bay (dd/mm/yyyy)"
                        />
                        <TbCalendarClock
                          className={styles["departure-date-icon"]}
                        />
                      </div>

                      <div className={styles["flight-time-input"]}>
                        <input
                          type="text"
                          placeholder="Thời gian bay (hh:mm)"
                        />
                        <FiClock className={styles["flight-time-icon"]} />
                      </div>

                      <div className={styles["seat-input"]}>
                        <input type="number" placeholder="Số lượng ghế" />
                        <MdAirlineSeatReclineNormal
                          className={styles["seat-icon"]}
                        />
                      </div>

                      {/* Thêm các thông tin khác nếu cần */}
                    </div>

                    {/* Bảng các hạng vé */}
                    <table className={styles["modal-table"]}>
                      <thead>
                        <tr>
                          <th>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              Hạng ghế
                              <MdOutlineEventSeat
                                style={{ marginLeft: "10px" }}
                              />
                            </div>
                          </th>
                          <th>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              Số lượng vé
                              <FaUserPlus style={{ marginLeft: "10px" }} />
                            </div>
                          </th>
                          <th>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              Thao tác
                              <RiListSettingsLine
                                style={{ marginLeft: "10px" }}
                              />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticketRows.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <div className={styles["ticket-type-input"]}>
                                <select
                                  value={row.seatClass}
                                  onChange={(e) => {
                                    const newRows = [...ticketRows];
                                    newRows[index].seatClass = e.target.value;
                                    setTicketRows(newRows);
                                  }}
                                >
                                  <option value="" disabled hidden>
                                    Hạng ghế
                                  </option>
                                  {seatOptions.map((option, i) => (
                                    <option key={i} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className={styles["ticket-quantity-input"]}>
                                <input
                                  type="number"
                                  value={row.quantity}
                                  onChange={(e) => {
                                    const newRows = [...ticketRows];
                                    newRows[index].quantity = e.target.value;
                                    setTicketRows(newRows);
                                  }}
                                  placeholder="Số lượng vé"
                                />
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => handleToggleRow(index)}
                                className={styles["ticket-action-button"]}
                                style={{
                                  backgroundColor: row.isAdded
                                    ? "#dc3545"
                                    : "#28a745", // đỏ hoặc xanh
                                }}
                              >
                                {row.isAdded ? (
                                  <>
                                    Xóa
                                    <FiTrash2 style={{ marginLeft: "20px" }} />
                                  </>
                                ) : (
                                  <>
                                    Thêm
                                    <FaPlusSquare
                                      style={{ marginLeft: "10px" }}
                                    />
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={3}>
                            <button
                              onClick={handleAddRow}
                              className={styles.addRowButton}
                            >
                              + Thêm dòng
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className={styles["modal-footer"]}>
                      <button
                        className={styles["modal-cancel-button"]}
                        onClick={() => {
                          setShowModalAddFlights(false);
                          setTicketRows([
                            { seatClass: "", quantity: "", isAdded: false },
                          ]);
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        className={styles["modal-save-button"]}
                        onClick={() => {
                          setShowModalAddFlights(false);
                          setTicketRows([
                            { seatClass: "", quantity: "", isAdded: false },
                          ]);
                        }}
                      >
                        Thêm chuyến bay
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                className={`${styles["action-button"]} ${styles["delete-button"]}`}
              >
                <FaEraser style={{ marginRight: "5px" }} /> Xóa chuyến bay đã
                chọn
              </button>
            </div>
          </div>

          <div className={styles["card-container"]}>
            {flights.map((flight) => (
              <FlightCardEdit key={flight.flight_id} data={flight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
