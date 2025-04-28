import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuTicketsPlane } from "react-icons/lu";
import { TbBuildingAirport } from "react-icons/tb";
import { BiMoneyWithdraw } from "react-icons/bi";
import styles from "./ManageFilter.module.css";

export default function ManageFilter() {
    const [ticketId, setTicketId] = useState("");
    const [departure, setDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");
    const [bookedSeats, setBookedSeats] = useState("");
    const [stopPoints, setStopPoints] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");

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

    const filteredDepartureLocations = locations.filter((location) =>
        location.toLowerCase().includes(departureSearch.toLowerCase()),
    );

    const filteredArrivalLocations = locations.filter((location) =>
        location.toLowerCase().includes(arrivalSearch.toLowerCase()),
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                departureRef.current &&
                !departureRef.current.contains(event.target)
            ) {
                setShowDepartureDropdown(false);
            }
            if (
                arrivalRef.current &&
                !arrivalRef.current.contains(event.target)
            ) {
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
                <div className={styles["filter-item"]}>
                    <label>Mã vé</label>
                    <div className={styles["input-with-icon"]}>
                        <input
                            type="text"
                            placeholder="VJ-123"
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                        />
                        <LuTicketsPlane className={styles["input-icon"]} />
                    </div>
                </div>

                <div className={styles["filter-item"]} ref={departureRef}>
                    <label>Nơi đi</label>
                    <div className={styles["location-selector"]}>
                        <div
                            className={`${styles["selected-location"]} ${departure ? styles["active"] : styles["placeholder"]}`}
                            onClick={() => {
                                setShowDepartureDropdown(
                                    !showDepartureDropdown,
                                );
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
                                        onChange={(e) =>
                                            setDepartureSearch(e.target.value)
                                        }
                                        autoFocus
                                    />
                                    <FaSearch
                                        className={styles["search-icon"]}
                                    />
                                </div>
                                <div className={styles["location-list"]}>
                                    {filteredDepartureLocations.map(
                                        (location, index) => (
                                            <div
                                                key={index}
                                                className={
                                                    styles["location-item"]
                                                }
                                                onClick={() => {
                                                    setDeparture(location);
                                                    setShowDepartureDropdown(
                                                        false,
                                                    );
                                                    setDepartureSearch("");
                                                }}
                                            >
                                                {location}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles["filter-item"]}>
                    <label>Số ghế trống</label>
                    <div className={styles["input-with-icon"]}>
                        <input
                            type="number"
                            placeholder="0"
                            value={availableSeats}
                            onChange={(e) => setAvailableSeats(e.target.value)}
                        />
                        <GoPeople className={styles["input-icon"]} />
                    </div>
                </div>

                <div className={styles["filter-item"]}>
                    <label>Giá tiền thấp nhất</label>
                    <div className={styles["input-with-icon"]}>
                        <input
                            type="text"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <BiMoneyWithdraw className={styles["input-icon"]} />
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
                        <MdOutlineCalendarMonth
                            className={styles["input-icon"]}
                        />
                    </div>
                </div>

                <div className={styles["filter-item"]}>
                    <label>Số điểm dừng trung gian</label>
                    <div className={styles["input-with-icon"]}>
                        <input
                            type="number"
                            placeholder="0"
                            value={stopPoints}
                            onChange={(e) => setStopPoints(e.target.value)}
                        />
                        <TbBuildingAirport className={styles["input-icon"]} />
                    </div>
                </div>

                <div className={styles["filter-item"]} ref={arrivalRef}>
                    <label>Nơi đến</label>
                    <div className={styles["location-selector"]}>
                        <div
                            className={`${styles["selected-location"]} ${styles["arrival"]} ${arrival ? styles["active"] : styles["placeholder"]}`}
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
                                        onChange={(e) =>
                                            setArrivalSearch(e.target.value)
                                        }
                                        autoFocus
                                    />
                                    <FaSearch
                                        className={styles["search-icon"]}
                                    />
                                </div>
                                <div className={styles["location-list"]}>
                                    {filteredArrivalLocations.map(
                                        (location, index) => (
                                            <div
                                                key={index}
                                                className={
                                                    styles["location-item"]
                                                }
                                                onClick={() => {
                                                    setArrival(location);
                                                    setShowArrivalDropdown(
                                                        false,
                                                    );
                                                    setArrivalSearch("");
                                                }}
                                            >
                                                {location}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles["filter-item"]}>
                    <label>Số ghế đặt</label>
                    <div className={styles["input-with-icon"]}>
                        <input
                            type="number"
                            placeholder="0"
                            value={bookedSeats}
                            onChange={(e) => setBookedSeats(e.target.value)}
                        />
                        <GoPeople className={styles["input-icon"]} />
                    </div>
                </div>

                <div className={styles["filter-item"]}>
                    <label>Giá tiền cao nhất</label>
                    <div className={styles["input-with-icon"]}>
                        <input
                            type="text"
                            placeholder="10,000,000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <BiMoneyWithdraw className={styles["input-icon"]} />
                    </div>
                </div>

                <div className={styles["filter-item"]}>
                    <label>Ngày đến</label>
                    <div className={styles["input-with-icon"]}>
                        <input
                            type="text"
                            placeholder="dd/mm/yyyy"
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                        />
                        <MdOutlineCalendarMonth
                            className={styles["input-icon"]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
