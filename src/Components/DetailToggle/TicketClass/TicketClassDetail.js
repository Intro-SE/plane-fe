import { useState } from "react";
import styles from "./TicketClassDetail.module.css";
import { Plus, Trash2 } from "lucide-react";

export default function TicketClassDetail({ onClose }) {
    const [ticketClasses, setTicketClasses] = useState([
        { code: "ECO", name: "Phổ thông" },
        { code: "BUS", name: "Thương gia" },
        { code: "FST", name: "Hạng nhất" },
    ]);

    const [newTicketClass, setNewTicketClass] = useState({
        code: "",
        name: "",
    });

    const handleDelete = (code) => {
        setTicketClasses(
            ticketClasses.filter((ticketClass) => ticketClass.code !== code),
        );
    };

    const handleAdd = () => {
        if (newTicketClass.code && newTicketClass.name) {
            setTicketClasses([...ticketClasses, { ...newTicketClass }]);
            setNewTicketClass({ code: "", name: "" });
        }
    };

    const handleNewTicketClassChange = (field, value) => {
        setNewTicketClass({
            ...newTicketClass,
            [field]: value,
        });
    };

    const handleCancel = () => {
        onClose();
    };

    const handleSave = () => {
        onClose();
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.header}>Quản lý hạng vé</h2>

                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableHeaderCell}>
                            <span>Mã hạng vé</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Tên hạng vé</span>
                        </div>
                        <div className={styles.tableHeaderCell}>
                            <span>Thao tác</span>
                        </div>
                    </div>

                    {ticketClasses.map((ticketClass, index) => (
                        <div key={index} className={styles.tableRow}>
                            <div className={styles.tableCell}>
                                {ticketClass.code}
                            </div>
                            <div className={styles.tableCell}>
                                {ticketClass.name}
                            </div>
                            <div className={styles.tableCell}>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() =>
                                        handleDelete(ticketClass.code)
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
                                className={styles.quantityInput}
                                placeholder="Mã hạng vé"
                                value={newTicketClass.code}
                                onChange={(e) =>
                                    handleNewTicketClassChange(
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
                                placeholder="Tên hạng vé"
                                value={newTicketClass.name}
                                onChange={(e) =>
                                    handleNewTicketClassChange(
                                        "name",
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
