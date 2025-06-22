import { useState, useEffect } from "react";
import styles from "./TicketClassDetail.module.css";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";

export default function TicketClassDetail({ setToast, onClose, setLoading }) {
    console.log(999);
    const [ticketClasses, setTicketClasses] = useState([]);
    const [newTicketClasses, setNewTicketClasses] = useState([]);
    useEffect(() => {
        const fetchTicketClassDetail = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/regulation/get_ticket_class",
                );
                setTicketClasses(response.data);
            } catch (error) {
                console.log(
                    "Lỗi khi lấy dữ liệu chi tiết hạng vé:",
                    error.response?.data || error.message,
                );
            } finally {
                setLoading(false);
            }
        };
        fetchTicketClassDetail();
    }, []);

    const [newTicketClass, setNewTicketClass] = useState({
        ticket_class_id: "",
        ticket_class_name: "",
    });

    const handleDelete = (ticket_class_id) => {
        // Remove from newTicketClasses
        setNewTicketClasses(
            newTicketClasses.filter(
                (ticketClass) =>
                    ticketClass.ticket_class_id !== ticket_class_id,
            ),
        );
        // Remove from ticketClasses
        setTicketClasses(
            ticketClasses.filter(
                (ticketClass) =>
                    ticketClass.ticket_class_id !== ticket_class_id,
            ),
        );
    };

    const handleAdd = () => {
        if (
            newTicketClass.ticket_class_id &&
            newTicketClass.ticket_class_name
        ) {
            const newTicketClassEntry = { ...newTicketClass };
            setTicketClasses([...ticketClasses, newTicketClassEntry]);
            setNewTicketClasses([...newTicketClasses, newTicketClassEntry]);
            setNewTicketClass({ ticket_class_id: "", ticket_class_name: "" });
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

    const handleSave = async () => {
        try {
            for (const ticket_class of newTicketClasses) {
                await axios.post(
                    "http://localhost:8000/api/v1/regulation/create_ticket_class",
                    {
                        ticket_class_id: ticket_class.ticket_class_id,
                        ticket_class_name: ticket_class.ticket_class_name,
                    },
                );
            }

            setToast({
                show: true,
                type: "success",
                message: "Cập nhật hạng vé thành công!",
            });
        } catch (error) {
            console.error(
                "Lỗi khi cập nhật hạng vé",
                error.response?.data || error.message,
            );
            setToast({
                show: true,
                type: "error",
                message: "Cập nhật hạng vé không thành công!",
            });
        }

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
                                {ticketClass.ticket_class_id}
                            </div>
                            <div className={styles.tableCell}>
                                {ticketClass.ticket_class_name}
                            </div>
                            <div className={styles.tableCell}>
                                <button
                                    className={`${styles.deleteButton} ${
                                        !newTicketClasses.some(
                                            (item) =>
                                                item.ticket_class_id ===
                                                ticketClass.ticket_class_id,
                                        )
                                            ? styles.disabledButton
                                            : ""
                                    }`}
                                    onClick={() =>
                                        newTicketClasses.some(
                                            (item) =>
                                                item.ticket_class_id ===
                                                ticketClass.ticket_class_id,
                                        ) &&
                                        handleDelete(
                                            ticketClass.ticket_class_id,
                                        )
                                    }
                                    disabled={
                                        !newTicketClasses.some(
                                            (item) =>
                                                item.ticket_class_id ===
                                                ticketClass.ticket_class_id,
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
                                className={styles.quantityInput}
                                placeholder="Mã hạng vé"
                                value={newTicketClass.ticket_class_id}
                                onChange={(e) =>
                                    handleNewTicketClassChange(
                                        "ticket_class_id",
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
                                value={newTicketClass.ticket_class_name}
                                onChange={(e) =>
                                    handleNewTicketClassChange(
                                        "ticket_class_name",
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
