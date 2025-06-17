import { useState } from "react";
import styles from "./AirportDetail.module.css";
import { Plus, Trash2 } from "lucide-react";

export default function AirportDetail() {
    const [airports, setAirports] = useState([
        { code: "TSN", name: "Tân Sơn Nhất", city: "TP HCM" },
        { code: "HAN", name: "Nội Bài", city: "Hà Nội" },
        { code: "DAN", name: "Đà Nẵng", city: "Đà Nẵng" },
    ]);

    const [newAirport, setNewAirport] = useState({
        code: "",
        name: "",
        city: "",
    });

    const handleDelete = (code) => {
        setAirports(airports.filter((airport) => airport.code !== code));
    };

    const handleAdd = () => {
        if (newAirport.code && newAirport.name && newAirport.city) {
            setAirports([...airports, { ...newAirport }]);
            setNewAirport({ code: "", name: "", city: "" });
        }
    };

    const handleNewAirportChange = (field, value) => {
        setNewAirport({
            ...newAirport,
            [field]: value,
        });
    };

    const handleCancel = () => {
        console.log("Hủy được nhấn");
    };

    const handleSave = () => {
        console.log("Lưu được nhấn");
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
                                {airport.code}
                            </div>
                            <div className={styles.tableCell}>
                                {airport.name}
                            </div>
                            <div className={styles.tableCell}>
                                {airport.city}
                            </div>
                            <div className={styles.tableCell}>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(airport.code)}
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
                                className={styles.quantityInput}
                                placeholder="Mã sân bay"
                                value={newAirport.code}
                                onChange={(e) =>
                                    handleNewAirportChange(
                                        "code",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                placeholder="Tên sân bay"
                                value={newAirport.name}
                                onChange={(e) =>
                                    handleNewAirportChange(
                                        "name",
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
                                value={newAirport.city}
                                onChange={(e) =>
                                    handleNewAirportChange(
                                        "city",
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
