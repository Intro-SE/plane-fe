import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuTicketsPlane } from "react-icons/lu";
import { TbBuildingAirport } from "react-icons/tb";
import { BiMoneyWithdraw } from "react-icons/bi";
import "./TicketFilter.css";

export default function TicketFilter() {
    // States cho tất cả các trường dữ liệu
    const [flightCode, setFlightCode] = useState("");
    const [departure, setDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");
    const [bookedSeats, setBookedSeats] = useState("");
    const [stopPoints, setStopPoints] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");

    // States cho dropdown
    const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
    const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);
    const [departureSearch, setDepartureSearch] = useState("");
    const [arrivalSearch, setArrivalSearch] = useState("");

    // Refs cho các dropdown để xử lý click outside
    const departureRef = useRef(null);
    const arrivalRef = useRef(null);

    // Danh sách các địa điểm mẫu
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

    // Lọc địa điểm dựa trên từ khóa tìm kiếm
    const filteredDepartureLocations = locations.filter((location) =>
        location.toLowerCase().includes(departureSearch.toLowerCase()),
    );

    const filteredArrivalLocations = locations.filter((location) =>
        location.toLowerCase().includes(arrivalSearch.toLowerCase()),
    );

    // Xử lý click bên ngoài để đóng dropdown
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
        <div className="flight-search-container">
            <div className="search-grid">
                {/* Mã chuyến bay */}
                <div className="search-item">
                    <label>Mã chuyến bay</label>
                    <div className="input-with-icon">
                        <input
                            type="text"
                            placeholder="VJ-123"
                            value={flightCode}
                            onChange={(e) => setFlightCode(e.target.value)}
                        />
                        <LuTicketsPlane className="input-icon" />
                    </div>
                </div>

                {/* Nơi đi */}
                <div className="search-item" ref={departureRef}>
                    <label>Nơi đi</label>
                    <div className="location-selector">
                        <div
                            className={`selected-location ${departure ? "active" : "placeholder"}`}
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
                                    className="remove-btn"
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
                            <div className="location-dropdown">
                                <div className="search-box">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm địa điểm..."
                                        value={departureSearch}
                                        onChange={(e) =>
                                            setDepartureSearch(e.target.value)
                                        }
                                        autoFocus
                                    />
                                    <FaSearch className="search-icon" />
                                </div>
                                <div className="location-list">
                                    {filteredDepartureLocations.map(
                                        (location, index) => (
                                            <div
                                                key={index}
                                                className="location-item"
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

                {/* Số ghế trống */}
                <div className="search-item">
                    <label>Số ghế trống</label>
                    <div className="input-with-icon">
                        <input
                            type="number"
                            placeholder="0"
                            value={availableSeats}
                            onChange={(e) => setAvailableSeats(e.target.value)}
                        />
                        <GoPeople className="input-icon" />
                    </div>
                </div>

                {/* Giá tiền thấp nhất */}
                <div className="search-item">
                    <label>Giá tiền thấp nhất</label>
                    <div className="input-with-icon">
                        <input
                            type="text"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <BiMoneyWithdraw className="input-icon" />
                    </div>
                </div>

                {/* Ngày đi */}
                <div className="search-item">
                    <label>Ngày đi</label>
                    <div className="input-with-icon">
                        <input
                            type="text"
                            placeholder="dd/mm/yyyy"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                        />
                        <MdOutlineCalendarMonth className="input-icon" />
                    </div>
                </div>

                {/* Số điểm dừng trung gian */}
                <div className="search-item">
                    <label>Số điểm dừng trung gian</label>
                    <div className="input-with-icon">
                        <input
                            type="number"
                            placeholder="0"
                            value={stopPoints}
                            onChange={(e) => setStopPoints(e.target.value)}
                        />
                        <TbBuildingAirport className="input-icon" />
                    </div>
                </div>

                {/* Nơi đến */}
                <div className="search-item" ref={arrivalRef}>
                    <label>Nơi đến</label>
                    <div className="location-selector">
                        <div
                            className={`selected-location arrival ${arrival ? "active" : "placeholder"}`}
                            onClick={() => {
                                setShowArrivalDropdown(!showArrivalDropdown);
                                setShowDepartureDropdown(false);
                            }}
                        >
                            <span>{arrival || "..."}</span>
                            {arrival && (
                                <button
                                    className="remove-btn"
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
                            <div className="location-dropdown">
                                <div className="search-box">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm địa điểm..."
                                        value={arrivalSearch}
                                        onChange={(e) =>
                                            setArrivalSearch(e.target.value)
                                        }
                                        autoFocus
                                    />
                                    <FaSearch className="search-icon" />
                                </div>
                                <div className="location-list">
                                    {filteredArrivalLocations.map(
                                        (location, index) => (
                                            <div
                                                key={index}
                                                className="location-item"
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

                {/* Số ghế đặt */}
                <div className="search-item">
                    <label>Số ghế đặt</label>
                    <div className="input-with-icon">
                        <input
                            type="number"
                            placeholder="0"
                            value={bookedSeats}
                            onChange={(e) => setBookedSeats(e.target.value)}
                        />
                        <GoPeople className="input-icon" />
                    </div>
                </div>

                {/* Giá tiền cao nhất */}
                <div className="search-item">
                    <label>Giá tiền cao nhất</label>
                    <div className="input-with-icon">
                        <input
                            type="text"
                            placeholder="10,000,000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <BiMoneyWithdraw className="input-icon" />
                    </div>
                </div>

                {/* Ngày đến */}
                <div className="search-item">
                    <label>Ngày đến</label>
                    <div className="input-with-icon">
                        <input
                            type="text"
                            placeholder="dd/mm/yyyy"
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                        />
                        <MdOutlineCalendarMonth className="input-icon" />
                    </div>
                </div>
            </div>
        </div>
    );
}
