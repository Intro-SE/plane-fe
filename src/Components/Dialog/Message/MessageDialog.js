import styles from "./MessageDialog.module.css";

export default function MessageDialog({
    show,
    type = "success",
    message = "",
    onClose,
}) {
    if (!show) return null;

    const isSuccess = type === "success";
    // const icon = isSuccess ? "✅" : "❌";
    const toastStyle = isSuccess ? styles.toastSuccess : styles.toastError;

    // Auto close after 3s
    setTimeout(() => {
        onClose?.();
    }, 3000);

    return (
        <div className={`${styles.toast} ${toastStyle}`}>
            {/* <span className={styles.icon}>{icon}</span> */}
            <span>{message}</span>
        </div>
    );
}
