import { useState, useEffect } from "react";
import styles from "./TicketClassDetail.module.css";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import axios from "axios";

export default function TicketClassDetail({ setToast, onClose, setLoading }) {
    console.log(999);
    const [ticketClasses, setTicketClasses] = useState([]);
    const [newTicketClasses, setNewTicketClasses] = useState([]);
    const [editingTicketClasses, setEditingTicketClasses] = useState({});
    const [modifiedTicketClasses, setModifiedTicketClasses] = useState([]);
    const [originalValues, setOriginalValues] = useState({});
    const [changedTicketClasses, setChangedTicketClasses] = useState({});
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
    }, [setLoading]);

    const [newTicketClass, setNewTicketClass] = useState({
        ticket_class_id: "",
        ticket_class_name: "",
        internal_id: "",
    });

    const handleDelete = (internalId) => {
        // Remove from newTicketClasses
        setNewTicketClasses(
            newTicketClasses.filter(
                (ticketClass) => ticketClass.internal_id !== internalId,
            ),
        );
        // Remove from ticketClasses
        setTicketClasses(
            ticketClasses.filter(
                (ticketClass) => ticketClass.internal_id !== internalId,
            ),
        );
        // Xóa khỏi editing state nếu đang edit
        const newEditingTicketClasses = { ...editingTicketClasses };
        delete newEditingTicketClasses[internalId];
        setEditingTicketClasses(newEditingTicketClasses);
    };

    const handleAdd = () => {
        if (newTicketClass.ticket_class_name) {
            const internalId = `internal_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const newTicketClassEntry = {
                ...newTicketClass,
                ticket_class_id: "HVxx",
                internal_id: internalId,
            };
            setTicketClasses([...ticketClasses, newTicketClassEntry]);
            setNewTicketClasses([...newTicketClasses, newTicketClassEntry]);
            setNewTicketClass({
                ticket_class_id: "",
                ticket_class_name: "",
                internal_id: "",
            });
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

    const handleEdit = (ticketClass) => {
        const key = ticketClass.internal_id || ticketClass.ticket_class_id;
        setEditingTicketClasses({
            ...editingTicketClasses,
            [key]: {
                ticket_class_name: ticketClass.ticket_class_name,
                internal_id: ticketClass.internal_id,
            },
        });

        // Lưu giá trị gốc để so sánh sau này
        setOriginalValues({
            ...originalValues,
            [key]: {
                ticket_class_name: ticketClass.ticket_class_name,
            },
        });
    };

    const handleEditChange = (key, field, value) => {
        setEditingTicketClasses({
            ...editingTicketClasses,
            [key]: {
                ...editingTicketClasses[key],
                [field]: value,
            },
        });
    };

    const handleSaveEdit = (ticketClass) => {
        const key = ticketClass.internal_id || ticketClass.ticket_class_id;
        const editedData = editingTicketClasses[key];
        const original = originalValues[key];

        // Kiểm tra có thay đổi không
        const hasChanged =
            original?.ticket_class_name !== editedData.ticket_class_name;

        // Cập nhật ticketClasses array
        setTicketClasses(
            ticketClasses.map((tc) => {
                const tcKey = tc.internal_id || tc.ticket_class_id;
                if (tcKey === key) {
                    return { ...tc, ...editedData };
                }
                return tc;
            }),
        );

        // Cập nhật trạng thái thay đổi
        if (hasChanged) {
            setChangedTicketClasses({
                ...changedTicketClasses,
                [key]: {
                    original: original,
                    current: {
                        ticket_class_name: editedData.ticket_class_name,
                    },
                },
            });
        }

        // Thêm vào modified ticket classes nếu không phải ticket class mới
        if (!ticketClass.internal_id) {
            const existingIndex = modifiedTicketClasses.findIndex(
                (tc) => tc.ticket_class_id === ticketClass.ticket_class_id,
            );
            if (existingIndex >= 0) {
                const updated = [...modifiedTicketClasses];
                updated[existingIndex] = { ...ticketClass, ...editedData };
                setModifiedTicketClasses(updated);
            } else {
                setModifiedTicketClasses([
                    ...modifiedTicketClasses,
                    { ...ticketClass, ...editedData },
                ]);
            }
        }

        // Xóa khỏi editing state
        const newEditingTicketClasses = { ...editingTicketClasses };
        delete newEditingTicketClasses[key];
        setEditingTicketClasses(newEditingTicketClasses);
    };

    const handleCancelEdit = (ticketClass) => {
        const key = ticketClass.internal_id || ticketClass.ticket_class_id;
        const newEditingTicketClasses = { ...editingTicketClasses };
        delete newEditingTicketClasses[key];
        setEditingTicketClasses(newEditingTicketClasses);

        // Xóa giá trị gốc nếu hủy edit
        const newOriginalValues = { ...originalValues };
        delete newOriginalValues[key];
        setOriginalValues(newOriginalValues);
    };

    const handleSave = async () => {
        try {
            // Lưu các hạng vé mới
            for (const ticket_class of newTicketClasses) {
                await axios.post(
                    "http://localhost:8000/api/v1/regulation/create_ticket_class",
                    {
                        ticket_class_id: ticket_class.ticket_class_id,
                        ticket_class_name: ticket_class.ticket_class_name,
                    },
                );
            }

            // // Cập nhật các hạng vé đã chỉnh sửa
            for (const ticket_class of modifiedTicketClasses) {
                await axios.put(
                    `http://localhost:8000/api/v1/regulation/update_ticket_class`,
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

                    {ticketClasses.map((ticketClass, index) => {
                        const key =
                            ticketClass.internal_id ||
                            ticketClass.ticket_class_id;
                        const isEditing = editingTicketClasses[key];
                        const isNewTicketClass = newTicketClasses.some(
                            (item) =>
                                item.internal_id === ticketClass.internal_id,
                        );
                        const hasChanged = changedTicketClasses[key];

                        return (
                            <div
                                key={index}
                                className={`${styles.tableRow} ${isEditing ? styles.editingRow : ""} ${hasChanged ? styles.changedRow : ""}`}
                            >
                                <div className={styles.tableCell}>
                                    <div className={styles.cellContent}>
                                        {ticketClass.ticket_class_id}
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <div className={styles.cellContent}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className={`${styles.quantityInput} ${styles.editingInput}`}
                                                value={
                                                    editingTicketClasses[key]
                                                        .ticket_class_name
                                                }
                                                onChange={(e) =>
                                                    handleEditChange(
                                                        key,
                                                        "ticket_class_name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <>
                                                <span>
                                                    {
                                                        ticketClass.ticket_class_name
                                                    }
                                                </span>
                                                {hasChanged &&
                                                    hasChanged.original
                                                        .ticket_class_name !==
                                                        ticketClass.ticket_class_name && (
                                                        <div
                                                            className={
                                                                styles.oldValue
                                                            }
                                                        >
                                                            Cũ:{" "}
                                                            {
                                                                hasChanged
                                                                    .original
                                                                    .ticket_class_name
                                                            }
                                                        </div>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <div className={styles.actionButtonGroup}>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    className={
                                                        styles.saveEditButton
                                                    }
                                                    onClick={() =>
                                                        handleSaveEdit(
                                                            ticketClass,
                                                        )
                                                    }
                                                >
                                                    <Save size={14} />
                                                </button>
                                                <button
                                                    className={
                                                        styles.cancelEditButton
                                                    }
                                                    onClick={() =>
                                                        handleCancelEdit(
                                                            ticketClass,
                                                        )
                                                    }
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className={
                                                        styles.editButton
                                                    }
                                                    onClick={() =>
                                                        handleEdit(ticketClass)
                                                    }
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                {isNewTicketClass && (
                                                    <button
                                                        className={
                                                            styles.deleteButton
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                ticketClass.internal_id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className={styles.tableRow}>
                        <div className={styles.tableCell}>
                            <input
                                type="text"
                                className={`${styles.quantityInput} ${styles.disabledInput}`}
                                placeholder="Mã tự động sinh"
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
