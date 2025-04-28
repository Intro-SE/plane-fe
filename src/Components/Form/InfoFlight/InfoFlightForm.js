import React, { useState, useEffect, useCallback } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import styles from "./InfoFlightForm.module.css";

export default function InfoFlightForm() {
    const ticketPrices = {
        ECO: "1,500,000 VND",
        BUS: "3,500,000 VND",
        FIRST: "7,000,000 VND",
        "": "0 VND",
    };

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        idNumber: "",
        phoneNumber: "",
        gender: "",
        ticketClass: "",
        price: "0 VND",
        getTicket: "",
    });

    const updatePriceByTicketClass = useCallback((ticketClass) => {
        return ticketPrices[ticketClass] || "0 VND";
    }, []);

    useEffect(() => {
        if (formData.ticketClass) {
            setFormData((prevData) => ({
                ...prevData,
                price: updatePriceByTicketClass(prevData.ticketClass),
            }));
        }
    }, [formData.ticketClass, updatePriceByTicketClass]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            if (checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    const handleClear = () => {
        setFormData({
            lastName: "",
            firstName: "",
            idNumber: "",
            phoneNumber: "",
            gender: "",
            ticketClass: "",
            price: "0 VND",
            getTicket: "",
        });
    };

    return (
        <div className={styles["form-container"]}>
            <div className={styles["form-header"]}>
                <h2>THÔNG TIN HÀNH KHÁCH</h2>
                <button
                    type="button"
                    className={styles["clear-btn"]}
                    onClick={handleClear}
                >
                    Xóa nhanh <FiTrash2 className={styles["trash-icon"]} />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                        <label htmlFor="lastName">Họ</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className={styles["form-control"]}
                            placeholder="NGUYỄN"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles["form-group"]}>
                        <label htmlFor="firstName">Tên</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className={styles["form-control"]}
                            placeholder="VĂN A"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div
                    className={`${styles["form-row"]} ${styles["three-columns"]}`}
                >
                    <div className={styles["form-group"]}>
                        <label htmlFor="idNumber">CMND/CCCD</label>
                        <input
                            type="text"
                            id="idNumber"
                            name="idNumber"
                            className={styles["form-control"]}
                            value={formData.idNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles["form-group"]}>
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className={styles["form-control"]}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div
                        className={`${styles["form-group"]} ${styles["gender-container"]}`}
                    >
                        <label>Giới tính</label>
                        <div className={styles["gender-group"]}>
                            <div className={styles["gender-option"]}>
                                <span>Nam</span>
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === "male"}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles["gender-option"]}>
                                <span>Nữ</span>
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === "female"}
                                    onChange={handleChange}
                                />
                            </div>
                            <FaRegUser className={styles["person-icon"]} />
                        </div>
                    </div>
                </div>

                <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                        <label htmlFor="ticketClass">Mã hạng vé</label>
                        <div className={styles["select-wrapper"]}>
                            <select
                                id="ticketClass"
                                name="ticketClass"
                                className={styles["form-control"]}
                                value={formData.ticketClass}
                                onChange={handleChange}
                            >
                                <option value="" disabled></option>
                                <option value="ECO">Economy</option>
                                <option value="BUS">Business</option>
                                <option value="FIRST">First Class</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles["form-group"]}>
                        <label htmlFor="price">Giá tiền</label>
                        <div className={styles["currency-input"]}>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                className={styles["form-control"]}
                                value={formData.price}
                                readOnly
                            />
                            <span className={styles["currency-symbol"]}>
                                <BiMoneyWithdraw />
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    className={`${styles["form-row"]} ${styles["bottom-row"]}`}
                >
                    <div
                        className={`${styles["form-group"]} ${styles["ticket-retrieval"]}`}
                    >
                        <label>Lấy vé:</label>
                        <div className={styles["checkbox-group"]}>
                            <div className={styles["ticket-option"]}>
                                <span>Có</span>
                                <input
                                    type="checkbox"
                                    name="getTicket"
                                    value="yes"
                                    checked={formData.getTicket === "yes"}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles["ticket-option"]}>
                                <span>Không</span>
                                <input
                                    type="checkbox"
                                    name="getTicket"
                                    value="no"
                                    checked={formData.getTicket === "no"}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles["action-buttons"]}>
                        <button
                            type="submit"
                            className={`${styles.btn} ${styles["btn-primary"]}`}
                        >
                            Lưu
                        </button>
                        <button
                            type="button"
                            className={`${styles.btn} ${styles["btn-secondary"]}`}
                            onClick={handleClear}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
