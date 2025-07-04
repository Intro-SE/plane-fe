import styles from "./TopBar.module.css";
import airlineLogo from "../../Assets/logo.png";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import ConfirmDialog from "../Dialog/Confirm/ConfirmDialog";
import { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";

export default function TopBar() {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [isLogout, setIsLogout] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className={styles["top-container"]}>
            <img
                src={airlineLogo}
                alt="Etihad logo"
                className={styles["airline-logo"]}
            />

            <div className={styles["right-section"]}>
                {isAuthenticated ? (
                    <div className={styles["authenticated-section"]}>
                        <div
                            className={styles["user-info"]}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <div className={styles["user-avatar"]}>
                                <FaUser className={styles["user-icon"]} />
                                <div
                                    className={styles["online-indicator"]}
                                ></div>
                            </div>
                            <span className={styles["user-name"]}>
                                Xin chào, {user?.employee_name || "Người dùng"}
                            </span>

                            {showTooltip && (
                                <div className={styles["user-tooltip"]}>
                                    <div className={styles["tooltip-content"]}>
                                        <div
                                            className={styles["tooltip-header"]}
                                        >
                                            <FaUser
                                                className={
                                                    styles["tooltip-icon"]
                                                }
                                            />
                                            <span>Thông tin nhân viên</span>
                                        </div>
                                        <div className={styles["tooltip-body"]}>
                                            <p>
                                                <strong>Id:</strong>{" "}
                                                {user?.employee_id ||
                                                    "Không có"}
                                            </p>
                                            <p>
                                                <strong>Tên:</strong>{" "}
                                                {user?.employee_name ||
                                                    "Không có"}
                                            </p>
                                            <p>
                                                <strong>Sđt:</strong>{" "}
                                                {user?.phone_number ||
                                                    "Không có"}
                                            </p>
                                            <p>
                                                <strong>Giới tính:</strong>{" "}
                                                {user?.gender || "Không có"}
                                            </p>
                                            <p>
                                                <strong>CCCD/CMND:</strong>{" "}
                                                {user?.national_id ||
                                                    "Không có"}
                                            </p>
                                            <p>
                                                <strong>
                                                    Ngày tạo tài khoản:
                                                </strong>{" "}
                                                {user?.created_date
                                                    ? new Date(
                                                          user.created_date,
                                                      ).toLocaleDateString(
                                                          "vi-VN",
                                                      )
                                                    : "Không có"}
                                            </p>
                                            <p>
                                                <strong>Trạng thái:</strong>{" "}
                                                <span
                                                    className={
                                                        styles["status-online"]
                                                    }
                                                >
                                                    Đang hoạt động
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className={styles["logout-button"]}
                            onClick={() => setIsLogout(true)}
                        >
                            <FaSignInAlt style={{ marginRight: "8px" }} />
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <div className={styles["guest-section"]}>
                        <div className={styles["guest-info"]}>
                            <div className={styles["guest-avatar"]}>
                                <FaUser className={styles["guest-icon"]} />
                                <div
                                    className={styles["offline-indicator"]}
                                ></div>
                            </div>
                            <span className={styles["guest-name"]}>Khách</span>
                        </div>
                        <button
                            className={styles["login-button"]}
                            onClick={() =>
                                (window.location.href = "/dang-nhap")
                            }
                        >
                            <FaSignInAlt style={{ marginRight: "8px" }} />
                            Đăng nhập
                        </button>
                    </div>
                )}
            </div>

            {isLogout && (
                <ConfirmDialog
                    open={isLogout}
                    message={"Bạn chắc chắn muốn đăng xuất đúng không?"}
                    onConfirm={() => {
                        logout();
                        window.location.href = "/";
                    }}
                    onCancel={() => setIsLogout(false)}
                />
            )}
        </div>
    );
}
