import React, { useState, useEffect, useCallback } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import "./InfoFlightForm.css";

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
        <div className="form-container">
            <div className="form-header">
                <h2>THÔNG TIN HÀNH KHÁCH</h2>
                <button
                    type="button"
                    className="clear-btn"
                    onClick={handleClear}
                >
                    Xóa nhanh <FiTrash2 className="trash-icon" />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="lastName">Họ</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="form-control"
                            placeholder="NGUYỄN"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Tên</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="form-control"
                            placeholder="VĂN A"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row three-columns">
                    <div className="form-group">
                        <label htmlFor="idNumber">CMND/CCCD</label>
                        <input
                            type="text"
                            id="idNumber"
                            name="idNumber"
                            className="form-control"
                            value={formData.idNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="form-control"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group gender-container">
                        <label>Giới tính</label>
                        <div className="gender-group">
                            <div className="gender-option">
                                <span>Nam</span>
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === "male"}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="gender-option">
                                <span>Nữ</span>
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === "female"}
                                    onChange={handleChange}
                                />
                            </div>
                            <FaRegUser className="person-icon" />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="ticketClass">Mã hạng vé</label>
                        <div className="select-wrapper">
                            <select
                                id="ticketClass"
                                name="ticketClass"
                                className="form-control"
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
                    <div className="form-group">
                        <label htmlFor="price">Giá tiền</label>
                        <div className="currency-input">
                            <input
                                type="text"
                                id="price"
                                name="price"
                                className="form-control"
                                value={formData.price}
                                readOnly
                            />
                            <span className="currency-symbol">
                                <BiMoneyWithdraw />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="form-row bottom-row">
                    <div className="form-group ticket-retrieval">
                        <label>Lấy vé:</label>
                        <div className="checkbox-group">
                            <div className="ticket-option">
                                <span>Có</span>
                                <input
                                    type="checkbox"
                                    name="getTicket"
                                    value="yes"
                                    checked={formData.getTicket === "yes"}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="ticket-option">
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
                    <div className="action-buttons">
                        <button type="submit" className="btn btn-primary">
                            Lưu
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
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
