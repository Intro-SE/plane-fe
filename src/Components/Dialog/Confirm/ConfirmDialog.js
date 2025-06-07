import React, { useEffect, useState } from "react";
import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [open]);

    if (!isVisible) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div 
            className={`${styles.overlay} ${isAnimating ? styles.overlayVisible : ''}`}
            onClick={handleOverlayClick}
        >
            <div className={`${styles.dialog} ${isAnimating ? styles.dialogVisible : ''}`}>
                <div className={styles.icon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                        <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="17" r="1" fill="currentColor"/>
                    </svg>
                </div>
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
