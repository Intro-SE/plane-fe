import { useEffect, useState } from "react";
import styles from "./AirportDetail.module.css";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import axios from "axios";

export default function AirportDetail({ setToast, onClose, setLoading }) {
    const [airports, setAirports] = useState([]);
    const [newAirports, setNewAirports] = useState([]);
    const [editingAirports, setEditingAirports] = useState({});
    const [modifiedAirports, setModifiedAirports] = useState([]);
    const [originalValues, setOriginalValues] = useState({});
    const [changedAirports, setChangedAirports] = useState({});

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
    }, [setLoading]);

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
        // Xóa khỏi editing state nếu đang edit
        const newEditingAirports = { ...editingAirports };
        delete newEditingAirports[internalId];
        setEditingAirports(newEditingAirports);
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

    const handleEdit = (airport) => {
        const key = airport.internal_id || airport.airport_id;
        setEditingAirports({
            ...editingAirports,
            [key]: {
                airport_name: airport.airport_name,
                airport_address: airport.airport_address,
                airport_id: airport.airport_id,
                internal_id: airport.internal_id,
            },
        });

        // Lưu giá trị gốc để so sánh sau này
        setOriginalValues({
            ...originalValues,
            [key]: {
                airport_name: airport.airport_name,
                airport_address: airport.airport_address,
            },
        });
    };

    const handleEditChange = (key, field, value) => {
        setEditingAirports({
            ...editingAirports,
            [key]: {
                ...editingAirports[key],
                [field]: value,
            },
        });
    };

    const handleSaveEdit = (airport) => {
        const key = airport.internal_id || airport.airport_id;
        const editedData = editingAirports[key];
        const original = originalValues[key];

        // Kiểm tra có thay đổi không
        const hasChanged =
            original?.airport_name !== editedData.airport_name ||
            original?.airport_address !== editedData.airport_address;

        // Cập nhật airports array
        setAirports(
            airports.map((a) => {
                const aKey = a.internal_id || a.airport_id;
                if (aKey === key) {
                    return { ...a, ...editedData };
                }
                return a;
            }),
        );

        // Cập nhật trạng thái thay đổi
        if (hasChanged) {
            setChangedAirports({
                ...changedAirports,
                [key]: {
                    original: original,
                    current: {
                        airport_name: editedData.airport_name,
                        airport_address: editedData.airport_address,
                    },
                },
            });
        }

        // Thêm vào modified airports nếu không phải airport mới
        if (!airport.internal_id) {
            const existingIndex = modifiedAirports.findIndex(
                (a) => a.airport_id === airport.airport_id,
            );
            if (existingIndex >= 0) {
                const updated = [...modifiedAirports];
                updated[existingIndex] = { ...airport, ...editedData };
                setModifiedAirports(updated);
            } else {
                setModifiedAirports([
                    ...modifiedAirports,
                    { ...airport, ...editedData },
                ]);
            }
        }

        // Xóa khỏi editing state
        const newEditingAirports = { ...editingAirports };
        delete newEditingAirports[key];
        setEditingAirports(newEditingAirports);
    };

    const handleCancelEdit = (airport) => {
        const key = airport.internal_id || airport.airport_id;
        const newEditingAirports = { ...editingAirports };
        delete newEditingAirports[key];
        setEditingAirports(newEditingAirports);

        // Xóa giá trị gốc nếu hủy edit
        const newOriginalValues = { ...originalValues };
        delete newOriginalValues[key];
        setOriginalValues(newOriginalValues);
    };

    const handleSave = async () => {
        try {
            // Lưu các sân bay mới
            for (const airport of newAirports) {
                await axios.post("http://localhost:8000/api/v1/airports_crud", {
                    airport_name: airport.airport_name,
                    airport_address: airport.airport_address,
                });
            }

            // Cập nhật các sân bay đã chỉnh sửa
            for (const airport of modifiedAirports) {
                await axios.put(
                    `http://localhost:8000/api/v1/airports_crud?airport_id=${airport.airport_id}`,
                    {
                        airport_name: airport.airport_name,
                        airport_address: airport.airport_address,
                    },
                );
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

                    {airports.map((airport, index) => {
                        const key = airport.internal_id || airport.airport_id;
                        const isEditing = editingAirports[key];
                        const isNewAirport = newAirports.some(
                            (item) => item.internal_id === airport.internal_id,
                        );
                        const hasChanged = changedAirports[key];

                        return (
                            <div
                                key={index}
                                className={`${styles.tableRow} ${isEditing ? styles.editingRow : ""} ${hasChanged ? styles.changedRow : ""}`}
                            >
                                <div className={styles.tableCell}>
                                    <div className={styles.cellContent}>
                                        {airport.airport_id}
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <div className={styles.cellContent}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className={`${styles.quantityInput} ${styles.editingInput}`}
                                                value={
                                                    editingAirports[key]
                                                        .airport_name
                                                }
                                                onChange={(e) =>
                                                    handleEditChange(
                                                        key,
                                                        "airport_name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <>
                                                <span>
                                                    {airport.airport_name}
                                                </span>
                                                {hasChanged &&
                                                    hasChanged.original
                                                        .airport_name !==
                                                        airport.airport_name && (
                                                        <div
                                                            className={
                                                                styles.oldValue
                                                            }
                                                        >
                                                            Cũ:{" "}
                                                            {
                                                                hasChanged
                                                                    .original
                                                                    .airport_name
                                                            }
                                                        </div>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <div className={styles.cellContent}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className={`${styles.quantityInput} ${styles.editingInput}`}
                                                value={
                                                    editingAirports[key]
                                                        .airport_address
                                                }
                                                onChange={(e) =>
                                                    handleEditChange(
                                                        key,
                                                        "airport_address",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <>
                                                <span>
                                                    {airport.airport_address}
                                                </span>
                                                {hasChanged &&
                                                    hasChanged.original
                                                        .airport_address !==
                                                        airport.airport_address && (
                                                        <div
                                                            className={
                                                                styles.oldValue
                                                            }
                                                        >
                                                            Cũ:{" "}
                                                            {
                                                                hasChanged
                                                                    .original
                                                                    .airport_address
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
                                                        handleSaveEdit(airport)
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
                                                            airport,
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
                                                        handleEdit(airport)
                                                    }
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                {isNewAirport && (
                                                    <button
                                                        className={
                                                            styles.deleteButton
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                airport.internal_id,
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
