import React, { useState, useRef, useEffect } from "react";
import styles from "./RevenueReport.module.css";
import { X, ChevronDown } from "react-feather";
import axios from "axios";
import MessageDialog from "../../Dialog/Message/MessageDialog";

export default function RevenueReport({ state, responseData }) {
    const now = new Date();

    const [activeTab, setActiveTab] = useState("monthly");

    // Monthly report variables
    const [monthlyReportMonth, setMonthlyReportMonth] = useState(null);
    const [monthlyReportYear, setMonthlyReportYear] = useState(null);
    const [monthlyReportData, setMonthlyReportData] = useState([]);

    // Yearly report variables
    const [yearlyReportYear, setYearlyReportYear] = useState(null);
    const [yearlyReportData, setYearlyReportData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [dropdowns, setDropdowns] = useState({
        monthlyMonth: false,
        monthlyYear: false,
        yearlyYear: false,
    });

    const [toast, setToast] = useState({
        show: false,
        type: "",
        message: "",
    });

    const dropdownRefs = useRef({});

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) =>
        (2025 - i).toString(),
    );

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setMonthlyReportMonth("");
        setMonthlyReportYear("");
        setYearlyReportYear("");
        setMonthlyReportData([]);
        setYearlyReportData([]);
        setDropdowns({
            monthlyMonth: false,
            monthlyYear: false,
            yearlyYear: false,
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
        if (field === "monthlyMonth") {
            setMonthlyReportMonth("");
        } else if (field === "yearlyYear") {
            setYearlyReportYear("");
        } else if (field === "monthlyYear") {
            setMonthlyReportYear("");
        }
    };

    const handleMonthlyMonthSelect = (month) => {
        setMonthlyReportMonth(month);
        setDropdowns((prev) => ({
            ...prev,
            monthlyMonth: false,
        }));
    };

    const handleYearlyYearSelect = (year) => {
        setYearlyReportYear(year);
        setDropdowns((prev) => ({
            ...prev,
            yearlyYear: false,
        }));
    };

    const handleMonthlyYearSelect = (year) => {
        setMonthlyReportYear(year);
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

    const fetchMonthlyReport = async (month, year) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:8000/api/v1/revenue_report/report_month`,
                {
                    report_month: month,
                    report_year: year,
                },
            );
            setMonthlyReportData(response.data);
        } catch (error) {
            console.error(
                "Lỗi khi tải báo cáo tháng",
                error.response?.data || error.message,
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchYearlyReport = async (year) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:8000/api/v1/revenue_report/report_year`,
                {
                    report_year: year,
                },
            );
            setYearlyReportData(response.data);
        } catch (error) {
            console.error(
                "Lỗi khi tải báo cáo năm",
                error.response?.data || error.message,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleViewReport = () => {
        if (
            activeTab === "monthly" &&
            monthlyReportMonth &&
            monthlyReportYear
        ) {
            fetchMonthlyReport(monthlyReportMonth, monthlyReportYear);
        } else if (activeTab === "yearly" && yearlyReportYear) {
            fetchYearlyReport(yearlyReportYear);
        } else {
            if (activeTab === "monthly") {
                setToast({
                    show: true,
                    type: "error",
                    message:
                        "Vui lòng chọn tháng và năm trước khi xem báo cáo!",
                });
            } else {
                setToast({
                    show: true,
                    type: "error",
                    message: "Vui lòng chọn năm trước khi xem báo cáo!",
                });
            }
        }
    };

    // Determine which data set to display
    const currentData =
        activeTab === "monthly"
            ? monthlyReportData.length > 0
                ? monthlyReportData
                : []
            : yearlyReportData.length > 0
              ? yearlyReportData
              : [];

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
                                ref={(el) =>
                                    (dropdownRefs.current.monthlyMonth = el)
                                }
                                style={{
                                    zIndex: dropdowns.monthlyMonth ? 1000 : 500,
                                }}
                            >
                                <button
                                    className={`${styles.dropdownButton} ${monthlyReportMonth ? styles.activeButton : ""}`}
                                    onClick={() =>
                                        toggleDropdown("monthlyMonth")
                                    }
                                >
                                    {monthlyReportMonth || "Chọn tháng"}
                                    {monthlyReportMonth ? (
                                        <X
                                            size={20}
                                            onClick={(e) =>
                                                clearSelection(
                                                    "monthlyMonth",
                                                    e,
                                                )
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
                                {dropdowns.monthlyMonth && (
                                    <div className={styles.dropdownMenu}>
                                        {months.map((month, index) => (
                                            <div
                                                key={index}
                                                className={styles.dropdownItem}
                                                onClick={() =>
                                                    handleMonthlyMonthSelect(
                                                        month,
                                                    )
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
                                    className={`${styles.dropdownButton} ${monthlyReportYear ? styles.activeButton : ""}`}
                                    onClick={() =>
                                        toggleDropdown("monthlyYear")
                                    }
                                >
                                    {monthlyReportYear || "Chọn năm"}
                                    {monthlyReportYear ? (
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
                            ref={(el) => (dropdownRefs.current.yearlyYear = el)}
                            style={{
                                zIndex: dropdowns.yearlyYear ? 1000 : 500,
                            }}
                        >
                            <button
                                className={`${styles.dropdownButton} ${yearlyReportYear ? styles.activeButton : ""}`}
                                onClick={() => toggleDropdown("yearlyYear")}
                            >
                                {yearlyReportYear || "Chọn năm"}
                                {yearlyReportYear ? (
                                    <X
                                        size={20}
                                        onClick={(e) =>
                                            clearSelection("yearlyYear", e)
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
                            {dropdowns.yearlyYear && (
                                <div className={styles.dropdownMenu}>
                                    {years.map((year, index) => (
                                        <div
                                            key={index}
                                            className={styles.dropdownItem}
                                            onClick={() =>
                                                handleYearlyYearSelect(year)
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

            <MessageDialog
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <div className={styles.tableContainer}>
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}>
                            <span></span>
                        </div>
                        <div className={styles.pulse}>
                            Đang tải dữ liệu báo cáo
                        </div>
                        <div className={styles.loadingText}>
                            Vui lòng chờ trong giây lát, chúng tôi đang chuẩn bị
                            báo cáo của bạn...
                        </div>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                {activeTab === "monthly" ? (
                                    <>
                                        <th>Chuyến bay</th>
                                        <th>Số vé</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Tháng</th>
                                        <th>Số chuyến bay</th>
                                    </>
                                )}
                                <th>Tỷ lệ</th>
                                <th>Doanh thu (VNĐ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {activeTab === "monthly" ? (
                                            <>
                                                <td>{row.flight_id}</td>
                                                <td>
                                                    {row.last_occupied_seats}
                                                </td>
                                                <td>{row.percertain}</td>
                                                <td>{row.revenue}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{row.month}</td>
                                                <td>{row.total_flight}</td>
                                                <td>{row.percertain}</td>
                                                <td>{row.revenue}</td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className={styles.noData}>
                                        {activeTab === "monthly"
                                            ? "Chọn tháng và năm, sau đó nhấn 'Xem báo cáo' để hiển thị dữ liệu"
                                            : "Chọn năm, sau đó nhấn 'Xem báo cáo' để hiển thị dữ liệu"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
