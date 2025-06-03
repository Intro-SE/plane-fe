import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";
import styles from "./LookupFilter.module.css";

export default function LookupFilter() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);
  const [showDepartureTimeDropdown, setShowDepartureTimeDropdown] =
    useState(false);
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
    <div className={styles["lookup-container"]}>
      <div className={styles["lookup-row"]}>
        <div className={styles["lookup-column"]} ref={departureRef}>
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
        <div className={styles["lookup-column"]} ref={arrivalRef}>
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
        <div className={styles["lookup-column"]}>
          <label>Ngày đi</label>
          <div className={styles["date-input"]}>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
            <MdOutlineCalendarMonth className={styles["calendar-icon"]} />
          </div>
        </div>
        <div className={styles["lookup-column"]}>
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
        <div className={styles["lookup-column"]}>
          <div className={styles["empty-seat-checkbox"]}>
            <input type="checkbox" id="empty-seat" />
            <label htmlFor="empty-seat">Còn trống</label>
          </div>
          <button className={styles["filter-btn"]}>Lọc</button>
        </div>
      </div>
    </div>
  );
}
