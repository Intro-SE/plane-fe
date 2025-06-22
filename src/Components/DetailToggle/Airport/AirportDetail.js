import { useEffect, useState } from "react";
import styles from "./AirportDetail.module.css";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import MessageDialog from "../../Dialog/Message/MessageDialog";

export default function AirportDetail({ setToast, onClose, setLoading }) {
    const [airports, setAirports] = useState([]);
    const [newAirports, setNewAirports] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchAirportDetail = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/airports_crud",
                );
                setAirports(response.data);
            } catch (error) {
                console.log(
                    "Lỗi khi lấy dữ liệu chi tiết sân bay:",
                    error.response?.data || error.message,
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAirportDetail();
    }, []);

    const [newAirport, setNewAirport] = useState({
        airport_id: "",
        airport_name: "",
        airport_address: "",
        internal_id: "",
    });

    const handleDelete = (internalId) => {
        // Chỉ cho phép xóa các sân bay mới được thêm vào
        setNewAirports(
            newAirports.filter((airport) => airport.internal_id !== internalId),
        );
        setAirports(
            airports.filter((airport) => airport.internal_id !== internalId),
        );
    };

    const handleAdd = () => {
        if (newAirport.airport_name && newAirport.airport_address) {
            // Tạo một ID nội bộ dựa trên timestamp và số ngẫu nhiên để phân biệt các sân bay
            const internalId = `internal_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const newAirportEntry = {
                ...newAirport,
                airport_id: "SBxx",
                internal_id: internalId,
            };
            setAirports([...airports, newAirportEntry]);
            setNewAirports([...newAirports, newAirportEntry]);
            setNewAirport({
                airport_id: "",
                airport_name: "",
                airport_address: "",
                internal_id: "",
            });
        }
    };

    const handleNewAirportChange = (field, value) => {
        setNewAirport({
            ...newAirport,
            [field]: value,
        });
    };

    const handleCancel = () => {
        onClose();
    };

    const handleSave = async () => {
        try {
            for (const airport of newAirports) {
                await axios.post("http://localhost:8000/api/v1/airports_crud", {
                    airport_name: airport.airport_name,
                    airport_address: airport.airport_address,
                });
            }

            setToast({
                show: true,
                type: "success",
                message: "Cập nhật sân bay thành công!",
            });
        } catch (error) {
            console.error(
                "Lỗi khi cập nhật sân bay",
                error.response?.data || error.message,
            );
            setToast({
                show: true,
                type: "error",
                message: "Cập nhật sân bay không thành công!",
            });
        }

        onClose();
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.header}>Quản lý sân bay</h2>

                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableHeaderCell}>
                            <span>Mã sân bay</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Tên sân bay</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Địa chỉ</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Thao tác</span>
                        </div>
                    </div>

                    {airports.map((airport, index) => (
                        <div key={index} className={styles.tableRow}>
                            <div className={styles.tableCell}>
                                {airport.airport_id}
                            </div>
                            <div className={styles.tableCell}>
                                {airport.airport_name}
                            </div>
                            <div className={styles.tableCell}>
                                {airport.airport_address}
                            </div>
                            <div className={styles.tableCell}>
                                <button
                                    className={`${styles.deleteButton} ${!newAirports.some((item) => item.internal_id === airport.internal_id) ? styles.disabledButton : ""}`}
                                    onClick={() =>
                                        newAirports.some(
                                            (item) =>
                                                item.internal_id ===
                                                airport.internal_id,
                                        ) && handleDelete(airport.internal_id)
                                    }
                                    disabled={
                                        !newAirports.some(
                                            (item) =>
                                                item.internal_id ===
                                                airport.internal_id,
                                        )
                                    }
                                >
                                    <Trash2 size={16} />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className={styles.tableRow}>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={`${styles.quantityInput} ${styles.disabledInput}`}
                                placeholder="Mã tự động sinh"
                                value={newAirport.airport_id}
                                onChange={(e) =>
                                    handleNewAirportChange(
                                        "airport_id",
                                        e.target.value,
                                    )
                                }
                                disabled
                                title="Mã sân bay được tạo tự động"
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Tên sân bay"
                                value={newAirport.airport_name}
                                onChange={(e) =>
                                    handleNewAirportChange(
                                        "airport_name",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Địa chỉ"
                                value={newAirport.airport_address}
                                onChange={(e) =>
                                    handleNewAirportChange(
                                        "airport_address",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <button
                                className={styles.addButton}
                                onClick={handleAdd}
                            >
                                <Plus size={16} />
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button
                        className={styles.cancelButton}
                        onClick={handleCancel}
                    >
                        Hủy
                    </button>
                    <button className={styles.saveButton} onClick={handleSave}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
