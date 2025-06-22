import React, { useState } from "react";
import styles from "./AddFlightBooking.module.css";
import {
    Calendar,
    Users,
    Clock,
    MapPin,
    User,
    Phone,
    Trash2,
    Plane,
} from "lucide-react";

export default function FlightBookingInfo() {
    const [flightCode, setFlightCode] = useState("");
    const [passengerName, setPassengerName] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("");
    const [ticketClass, setTicketClass] = useState("...");
    const [flightInfo, setFlightInfo] = useState(null);

    const flightData = {
        "VJ-123": {
            code: "VJ-123",
            date: "31/12/2025",
            passengers: 200,
            departure: { time: "9:00", airport: "TPHCM", gate: "Tân Sơn Nhất" },
            arrival: { time: "11:00", airport: "Hà Nội", gate: "Nội Bài" },
        },
        "VN-456": {
            code: "VN-456",
            date: "01/01/2026",
            passengers: 180,
            departure: { time: "14:30", airport: "Hà Nội", gate: "Nội Bài" },
            arrival: { time: "16:45", airport: "Đà Nẵng", gate: "Đà Nẵng" },
        },
        "QH-789": {
            code: "QH-789",
            date: "02/01/2026",
            passengers: 150,
            departure: { time: "8:15", airport: "TPHCM", gate: "Tân Sơn Nhất" },
            arrival: { time: "9:30", airport: "Cần Thơ", gate: "Cần Thơ" },
        },
    };

    const handleFlightCodeChange = (e) => {
        const code = e.target.value.toUpperCase();
        setFlightCode(code);
        setFlightInfo(flightData[code] || null);
    };

    const clearForm = () => {
        setFlightCode("");
        setPassengerName("");
        setIdNumber("");
        setPhoneNumber("");
        setGender("");
        setTicketClass("...");
        setFlightInfo(null);
    };

    return (
        <div className={styles.container}>
            {flightInfo && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.flightCode}>{flightInfo.code}</h2>
                        <div className={styles.iconCircle}>
                            <Plane size={16} className={styles.iconBlue} />
                        </div>
                    </div>

                    <div className={styles.flightMeta}>
                        <div className={styles.metaItem}>
                            <div className={styles.metaIcon}>
                                <Calendar size={14} />
                            </div>
                            <span>{flightInfo.date}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <div className={styles.metaIcon}>
                                <Users size={14} />
                            </div>
                            <span>{flightInfo.passengers}</span>
                        </div>
                    </div>

                    <div className={styles.segment + " " + styles.departure}>
                        <div className={styles.segmentItem}>
                            <div className={styles.segmentIcon}>
                                <Clock size={16} />
                            </div>
                            <span>{flightInfo.departure.time}</span>
                        </div>
                        <div className={styles.segmentItem}>
                            <div className={styles.segmentIconBlue}>
                                <MapPin size={16} />
                            </div>
                            <span>{flightInfo.departure.airport}</span>
                        </div>
                        <div className={styles.segmentItem}>
                            <User size={16} />
                            <span>{flightInfo.departure.gate}</span>
                        </div>
                    </div>

                    <div className={styles.segment + " " + styles.arrival}>
                        <div className={styles.segmentItem}>
                            <div className={styles.segmentIcon}>
                                <Clock size={16} />
                            </div>
                            <span>{flightInfo.arrival.time}</span>
                        </div>
                        <div className={styles.segmentItem}>
                            <div className={styles.segmentIconBlue}>
                                <MapPin size={16} />
                            </div>
                            <span>{flightInfo.arrival.airport}</span>
                        </div>
                        <div className={styles.segmentItem}>
                            <User size={16} />
                            <span>{flightInfo.arrival.gate}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3>THÔNG TIN HÀNH KHÁCH</h3>
                    <button onClick={clearForm} className={styles.clearButton}>
                        <Trash2 size={16} /> Xóa nhanh
                    </button>
                </div>

                <div className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Mã chuyến bay</label>
                            <input
                                value={flightCode}
                                onChange={handleFlightCodeChange}
                                placeholder="VJ-123"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Họ và tên</label>
                            <input
                                value={passengerName}
                                onChange={(e) =>
                                    setPassengerName(e.target.value)
                                }
                                placeholder="NGUYỄN VĂN A"
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>CMND/CCCD</label>
                            <input
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                placeholder="0xxx-xxxx-xxxx"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Số điện thoại</label>
                            <div className={styles.inputWithIcon}>
                                <input
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    placeholder="0xxx-xxx-xxx"
                                />
                                <Phone size={16} />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Giới tính</label>
                            <div className={styles.radioGroup}>
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Nam"
                                        checked={gender === "Nam"}
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                    />{" "}
                                    Nam
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Nữ"
                                        checked={gender === "Nữ"}
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                    />{" "}
                                    Nữ
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Hạng vé</label>
                            <select
                                value={ticketClass}
                                onChange={(e) => setTicketClass(e.target.value)}
                            >
                                <option value="...">...</option>
                                <option value="Phổ thông">Phổ thông</option>
                                <option value="Thương gia">Thương gia</option>
                                <option value="Hạng nhất">Hạng nhất</option>
                            </select>
                        </div>
                        <div className={styles.priceBox}>
                            Giá tiền: <strong>0 VNĐ</strong>
                        </div>
                        <div className={styles.buttonGroup}>
                            <button className={styles.cancelButton}>Hủy</button>
                            <button className={styles.saveButton}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            {!flightInfo && flightCode && (
                <div className={styles.warningBox}>
                    Không tìm thấy chuyến bay "<strong>{flightCode}</strong>".
                    Thử với: VJ-123, VN-456, hoặc QH-789
                </div>
            )}
        </div>
    );
}
