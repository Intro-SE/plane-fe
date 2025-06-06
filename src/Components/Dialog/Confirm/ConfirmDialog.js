import React from "react";
import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <div className={styles.icon}>!</div>
                <div className={styles.content}>
                    <h2 className={styles.title}>Cảnh báo!</h2>
                    <p className={styles.message}>{message}</p>
                    <div className={styles.actions}>
                        <button
                            className={styles.cancelButton}
                            onClick={onCancel}
                        >
                            Hủy
                        </button>
                        <button
                            className={styles.confirmButton}
                            onClick={onConfirm}
                        >
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
