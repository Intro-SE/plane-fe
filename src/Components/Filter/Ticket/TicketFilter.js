import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuTicketsPlane } from "react-icons/lu";
import { LuPhone } from "react-icons/lu";
import { TbBuildingAirport } from "react-icons/tb";
import { FaDongSign } from "react-icons/fa6";
import { BiMoneyWithdraw } from "react-icons/bi";
import { LuUserRoundPen } from "react-icons/lu";
import { LuIdCard } from "react-icons/lu";
import styles from "./TicketFilter.module.css";
import axios from "axios";

export default function TicketFilter({ onSendData = () => {} }) {
  const [flightCode, setFlightCode] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [ticketClass, setTicketClass] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [locations, setLocations] = useState([]);
  const [ticketClasses, setTicketClasses] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [customerID, setCustomerID] = useState("");

  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);
  const [showTicketClassDropdown, setShowTicketClassDropdown] = useState(false);

  const [departureSearch, setDepartureSearch] = useState("");
  const [arrivalSearch, setArrivalSearch] = useState("");
  const [ticketClassSearch, setTicketClassSearch] = useState("");

  const departureRef = useRef(null);
  const arrivalRef = useRef(null);
  const ticketClassRef = useRef(null);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/airports_crud`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = response.data;
        setLocations(data.map((item) => item.airport_address));
      } catch (error) {
        console.error(
          "Lỗi khi lấy dữ liệu địa điểm:",
          error.response?.data || error.message
        );
      }
    };

    getLocations();
  }, []);

  useEffect(() => {
    const getTicketClasses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/tickets_crud`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = response.data;
        setTicketClasses([
          ...new Set(data.map((item) => item.ticket_class.ticket_class_name)),
        ]);
      } catch (error) {
        console.error(
          "Lỗi khi lấy dữ liệu địa điểm:",
          error.response?.data || error.message
        );
      }
    };

    getTicketClasses();
  }, []);

  const filteredDepartureLocations = locations.filter((location) =>
    location.toLowerCase().includes(departureSearch.toLowerCase())
  );

  const filteredArrivalLocations = locations.filter((location) =>
    location.toLowerCase().includes(arrivalSearch.toLowerCase())
  );

  const filteredTicketClasses = ticketClasses.filter((ticketClass) =>
    ticketClass.toLowerCase().includes(ticketClassSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        departureRef.current &&
        !departureRef.current.contains(event.target)
      ) {
        setShowDepartureDropdown(false);
      }
      if (arrivalRef.current && !arrivalRef.current.contains(event.target)) {
        setShowArrivalDropdown(false);
      }

      if (
        ticketClassRef.current &&
        !ticketClassRef.current.contains(event.target)
      ) {
        setShowTicketClassDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    function formatDate(dateStr) {
      if (!dateStr) return null;
      // Nếu đang là chuỗi "dd/mm/yyyy" thì chuyển về "yyyy-mm-dd"
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
      }
      return dateStr; // fallback nếu đã đúng định dạng yyyy-mm-dd
    }

    function getNumberValue(num) {
      const value = parseInt(num, 10);
      return isNaN(value) ? 0 : value;
    }

    const data = {
      departure_address: departure || "",
      arrival_address: arrival || "",
      booking_ticket_id: ticketCode || "",
      ticket_class_name: ticketClass || "",
      departure_date: formatDate(departureDate) || "",
      flight_id: flightCode || "",
      min_price: getNumberValue(minPrice),
      max_price: getNumberValue(maxPrice),
      passenger_name: customerName || "",
      national_id: customerID || "",
      passenger_phone: phone_number || "",
    };

    console.log("[DEBUG] Dữ liệu lọc gửi:", data);
    onSendData(data);
  };

  return (
    <div className={styles["ticket-filter-container"]}>
      <div className={styles["filter-grid"]}>
        <div className={styles["filter-item"]} ref={departureRef}>
          <label>Nơi đi</label>
          <div className={styles["location-selector"]}>
            <div
              className={`${styles["selected-location"]} ${
                departure ? styles["active"] : styles["placeholder"]
              }`}
              onClick={() => {
                setShowDepartureDropdown(!showDepartureDropdown);
                setShowTicketClassDropdown(false);
                setShowArrivalDropdown(false);
              }}
            >
              <span>{departure || "..."}</span>
              {departure && (
                <button
                  className={styles["remove-btn"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeparture("");
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {showDepartureDropdown && (
              <div className={styles["location-dropdown"]}>
                <div className={styles["search-box"]}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm địa điểm..."
                    value={departureSearch}
                    onChange={(e) => setDepartureSearch(e.target.value)}
                    autoFocus
                  />
                  <FaSearch className={styles["search-icon"]} />
                </div>
                <div className={styles["location-list"]}>
                  {filteredDepartureLocations.map((location, index) => (
                    <div
                      key={index}
                      className={styles["location-item"]}
                      onClick={() => {
                        setDeparture(location);
                        setShowDepartureDropdown(false);
                        setDepartureSearch("");
                      }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Mã vé</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="text"
              placeholder="VJ-123"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
            />
            <LuTicketsPlane className={styles["input-icon"]} size={16} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Ngày đi</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
            <MdOutlineCalendarMonth className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Giá tiền thấp nhất</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <FaDongSign className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Tên khách hàng</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <LuUserRoundPen className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Số điện thoại</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="text"
              placeholder="0xxx-xxx-xxx"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <LuPhone className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]} ref={arrivalRef}>
          <label>Nơi đến</label>
          <div className={styles["location-selector"]}>
            <div
              className={`${styles["selected-location"]} ${styles["arrival"]} ${
                arrival ? styles["active"] : styles["placeholder"]
              }`}
              onClick={() => {
                setShowArrivalDropdown(!showArrivalDropdown);
                setShowTicketClassDropdown(false);
                setShowDepartureDropdown(false);
              }}
            >
              <span>{arrival || "..."}</span>
              {arrival && (
                <button
                  className={styles["remove-btn"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setArrival("");
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {showArrivalDropdown && (
              <div className={styles["location-dropdown"]}>
                <div className={styles["search-box"]}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm địa điểm..."
                    value={arrivalSearch}
                    onChange={(e) => setArrivalSearch(e.target.value)}
                    autoFocus
                  />
                  <FaSearch className={styles["search-icon"]} />
                </div>
                <div className={styles["location-list"]}>
                  {filteredArrivalLocations.map((location, index) => (
                    <div
                      key={index}
                      className={styles["location-item"]}
                      onClick={() => {
                        setArrival(location);
                        setShowArrivalDropdown(false);
                        setArrivalSearch("");
                      }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles["filter-item"]} ref={ticketClassRef}>
          <label>Hạng vé</label>
          <div className={styles["location-selector"]}>
            <div
              className={`${styles["selected-location"]} ${
                ticketClass ? styles["active"] : styles["placeholder"]
              }`}
              onClick={() => {
                setShowTicketClassDropdown(!showTicketClassDropdown);
                setShowDepartureDropdown(false);
                setShowArrivalDropdown(false);
              }}
            >
              <span>{ticketClass || "..."}</span>
              {ticketClass && (
                <button
                  className={styles["remove-btn"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTicketClass("");
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {showTicketClassDropdown && (
              <div className={styles["location-dropdown"]}>
                <div className={styles["search-box"]}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm hạng vé..."
                    value={ticketClassSearch}
                    onChange={(e) => setTicketClassSearch(e.target.value)}
                    autoFocus
                  />
                  <FaSearch className={styles["search-icon"]} />
                </div>
                <div className={styles["location-list"]}>
                  {filteredTicketClasses.map((ticketClass, index) => (
                    <divs
                      key={index}
                      className={styles["location-item"]}
                      onClick={() => {
                        setTicketClass(ticketClass);
                        setShowTicketClassDropdown(false);
                        setTicketClassSearch("");
                      }}
                    >
                      {ticketClass}
                    </divs>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Mã chuyến bay</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="text"
              placeholder="VJ-123"
              value={flightCode}
              onChange={(e) => setFlightCode(e.target.value)}
            />
            <LuTicketsPlane className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Giá tiền cao nhất</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="number"
              placeholder="10000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <FaDongSign className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>CMND/CCCD</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="text"
              placeholder="0xxx-xxxx-xxxx"
              value={customerID}
              onChange={(e) => setCustomerID(e.target.value)}
            />
            <LuIdCard className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <button className={styles["filter-btn"]} onClick={handleClick}>
            Lọc
          </button>
        </div>
      </div>
    </div>
  );
}
