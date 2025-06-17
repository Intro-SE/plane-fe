import React, { useState, useRef, useEffect } from "react";
import styles from "./RevenueReport.module.css";
import { X, ChevronDown } from "react-feather";

export default function RevenueReport() {
    const [activeTab, setActiveTab] = useState("monthly");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [monthlyYear, setMonthlyYear] = useState("");
    const [dropdowns, setDropdowns] = useState({
        month: false,
        year: false,
        monthlyYear: false,
    });

    const dropdownRefs = useRef({});

    // Sample data
    const monthlyData = [
        {
            stt: 1,
            chuyenBay: "VJ-123",
            soVe: 150,
            tyLe: "75%",
            doanhThu: "15,000,000",
        },
        {
            stt: 2,
            chuyenBay: "VJ-456",
            soVe: 200,
            tyLe: "80%",
            doanhThu: "20,000,000",
        },
    ];

    const yearlyData = [
        {
            stt: 1,
            chuyenBay: "VJ-789",
            soVe: 1800,
            tyLe: "85%",
            doanhThu: "180,000,000",
        },
        {
            stt: 2,
            chuyenBay: "VJ-012",
            soVe: 2200,
            tyLe: "90%",
            doanhThu: "220,000,000",
        },
    ];

    const months = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

    const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) =>
        (2025 - i).toString(),
    );

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectedMonth("");
        setSelectedYear("");
        setMonthlyYear("");
        setDropdowns({
            month: false,
            year: false,
            monthlyYear: false,
        });
    };

    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }));
    };

    const clearSelection = (field, event) => {
        event.stopPropagation();
        if (field === "month") {
            setSelectedMonth("");
        } else if (field === "year") {
            setSelectedYear("");
        } else if (field === "monthlyYear") {
            setMonthlyYear("");
        }
    };

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        setDropdowns((prev) => ({
            ...prev,
            month: false,
        }));
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setDropdowns((prev) => ({
            ...prev,
            year: false,
        }));
    };

    const handleMonthlyYearSelect = (year) => {
        setMonthlyYear(year);
        setDropdowns((prev) => ({
            ...prev,
            monthlyYear: false,
        }));
    };

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdowns).forEach((key) => {
                if (
                    dropdownRefs.current[key] &&
                    !dropdownRefs.current[key].contains(event.target) &&
                    dropdowns[key]
                ) {
                    setDropdowns((prev) => ({
                        ...prev,
                        [key]: false,
                    }));
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdowns]);

    const handleViewReport = () => {
        if (activeTab === "monthly" && selectedMonth && monthlyYear) {
            alert(`Xem báo cáo doanh thu ${selectedMonth} năm ${monthlyYear}`);
        } else if (activeTab === "yearly" && selectedYear) {
            alert(`Xem báo cáo doanh thu năm ${selectedYear}`);
        } else {
            if (activeTab === "monthly") {
                alert("Vui lòng chọn tháng và năm trước khi xem báo cáo");
            } else {
                alert("Vui lòng chọn năm trước khi xem báo cáo");
            }
        }
    };

    const currentData = activeTab === "monthly" ? monthlyData : yearlyData;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    className={`${styles.tabButton} ${activeTab === "monthly" ? styles.activeTab : styles.inactiveTab}`}
                    onClick={() => handleTabClick("monthly")}
                >
                    BÁO CÁO DOANH THU THÁNG
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "yearly" ? styles.activeTab : styles.inactiveTab}`}
                    onClick={() => handleTabClick("yearly")}
                >
                    BÁO CÁO DOANH THU NĂM
                </button>
            </div>

            <div className={styles.controls}>
                {activeTab === "monthly" ? (
                    <>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Tháng</label>
                            <div
                                className={styles.dropdown}
                                ref={(el) => (dropdownRefs.current.month = el)}
                                style={{
                                    zIndex: dropdowns.month ? 1000 : 500,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${selectedMonth ? styles.activeButton : ""}`}
                                    onClick={() => toggleDropdown("month")}
                                >
                                    {selectedMonth || "Chọn tháng"}
                                    {selectedMonth ? (
                                        <X
                                            size={20}
                                            onClick={(e) =>
                                                clearSelection("month", e)
                                            }
                                            className={styles.clearIcon}
                                        />
                                    ) : (
                                        <ChevronDown
                                            className={styles.inputIcon}
                                            size={20}
                                        />
                                    )}
                                </button>
                                {dropdowns.month && (
                                    <div className={styles.dropdownMenu}>
                                        {months.map((month, index) => (
                                            <div
                                                key={index}
                                                className={styles.dropdownItem}
                                                onClick={() =>
                                                    handleMonthSelect(month)
                                                }
                                            >
                                                {month}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Năm</label>
                            <div
                                className={styles.dropdown}
                                ref={(el) =>
                                    (dropdownRefs.current.monthlyYear = el)
                                }
                                style={{
                                    zIndex: dropdowns.monthlyYear ? 1000 : 500,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${monthlyYear ? styles.activeButton : ""}`}
                                    onClick={() =>
                                        toggleDropdown("monthlyYear")
                                    }
                                >
                                    {monthlyYear || "Chọn năm"}
                                    {monthlyYear ? (
                                        <X
                                            size={20}
                                            onClick={(e) =>
                                                clearSelection("monthlyYear", e)
                                            }
                                            className={styles.clearIcon}
                                        />
                                    ) : (
                                        <ChevronDown
                                            className={styles.inputIcon}
                                            size={20}
                                        />
                                    )}
                                </button>
                                {dropdowns.monthlyYear && (
                                    <div className={styles.dropdownMenu}>
                                        {years.map((year, index) => (
                                            <div
                                                key={index}
                                                className={styles.dropdownItem}
                                                onClick={() =>
                                                    handleMonthlyYearSelect(
                                                        year,
                                                    )
                                                }
                                            >
                                                {year}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Năm</label>
                        <div
                            className={styles.dropdown}
                            ref={(el) => (dropdownRefs.current.year = el)}
                            style={{
                                zIndex: dropdowns.year ? 1000 : 500,
                            }}
                        >
                            <button
                                className={`${styles.dropdownButton} ${selectedYear ? styles.activeButton : ""}`}
                                onClick={() => toggleDropdown("year")}
                            >
                                {selectedYear || "Chọn năm"}
                                {selectedYear ? (
                                    <X
                                        size={20}
                                        onClick={(e) =>
                                            clearSelection("year", e)
                                        }
                                        className={styles.clearIcon}
                                    />
                                ) : (
                                    <ChevronDown
                                        className={styles.inputIcon}
                                        size={20}
                                    />
                                )}
                            </button>
                            {dropdowns.year && (
                                <div className={styles.dropdownMenu}>
                                    {years.map((year, index) => (
                                        <div
                                            key={index}
                                            className={styles.dropdownItem}
                                            onClick={() =>
                                                handleYearSelect(year)
                                            }
                                        >
                                            {year}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.viewButton}
                    onClick={handleViewReport}
                >
                    Xem báo cáo
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Chuyến bay</th>
                            <th>Số vé</th>
                            <th>Tỷ lệ</th>
                            <th>Doanh thu (VNĐ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row) => (
                            <tr key={row.stt}>
                                <td>{row.stt}</td>
                                <td>{row.chuyenBay}</td>
                                <td>{row.soVe}</td>
                                <td>{row.tyLe}</td>
                                <td>{row.doanhThu}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
