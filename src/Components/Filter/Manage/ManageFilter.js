import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuTicketsPlane } from "react-icons/lu";
import styles from "./ManageFilter.module.css";

export default function ManageFilter() {
  const [flightId, setFlightId] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [minAvailableSeats, setMinAvailableSeats] = useState("");
  const [minSumSeats, setMinSumSeats] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const [showDepartureTimeDropdown, setShowDepartureTimeDropdown] =
    useState(false);
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);
  const [departureSearch, setDepartureSearch] = useState("");
  const [arrivalSearch, setArrivalSearch] = useState("");

  const departureRef = useRef(null);
  const arrivalRef = useRef(null);

  const locations = [
    "Hà Nội",
    "TPHCM",
    "Đà Nẵng",
    "Nha Trang",
    "Huế",
    "Phú Quốc",
    "Đà Lạt",
    "Hải Phòng",
    "Cần Thơ",
    "Quy Nhơn",
  ];

  const departure_time = ["0h - 6h", "6h - 12h", "12h - 18h", "18h - 24h"];

  const filteredDepartureLocations = locations.filter((location) =>
    location.toLowerCase().includes(departureSearch.toLowerCase())
  );

  const filteredArrivalLocations = locations.filter((location) =>
    location.toLowerCase().includes(arrivalSearch.toLowerCase())
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <label>Số ghế trống ít nhất</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="number"
              placeholder="0"
              value={minAvailableSeats}
              onChange={(e) => setMinAvailableSeats(e.target.value)}
            />
            <GoPeople className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Mã chuyến bay</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="text"
              placeholder="VJ-123"
              value={flightId}
              onChange={(e) => setFlightId(e.target.value)}
            />
            <LuTicketsPlane className={styles["input-icon"]} />
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

        <div className={styles["filter-item"]}>
          <label>Giờ đi</label>
          <div className={styles["location-selector"]}>
            <div
              className={`${styles["selected-location"]} ${
                departureTime ? styles["active"] : styles["placeholder"]
              }`}
              onClick={() => {
                setShowDepartureTimeDropdown(!showDepartureTimeDropdown);
                setShowArrivalDropdown(false);
                setShowDepartureDropdown(false);
              }}
            >
              <span>{departureTime || "..."}</span>
              {departureTime && (
                <button
                  className={styles["remove-btn"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDepartureTime("");
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {showDepartureTimeDropdown && (
              <div className={styles["location-dropdown"]}>
                <div className={styles["location-list"]}>
                  {departure_time.map((time, index) => (
                    <div
                      key={index}
                      className={styles["location-item"]}
                      onClick={() => {
                        setDepartureTime(time);
                        setShowDepartureTimeDropdown(false);
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <label>Tổng số ghế ít nhất</label>
          <div className={styles["input-with-icon"]}>
            <input
              type="number"
              placeholder="0"
              value={minSumSeats}
              onChange={(e) => setMinSumSeats(e.target.value)}
            />
            <GoPeople className={styles["input-icon"]} />
          </div>
        </div>

        <div className={styles["filter-item"]}>
          <button className={styles["filter-btn"]}>Lọc</button>
        </div>
      </div>
    </div>
  );
}
