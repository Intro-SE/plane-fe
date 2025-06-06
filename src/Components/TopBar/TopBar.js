import styles from "./TopBar.module.css";
import airlineLogo from "../../Assets/logo.png";
import { useFlag } from "../../FlagContext";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import ConfirmDialog from "../Dialog/Confirm/ConfirmDialog";
import { useState } from "react";

export default function TopBar() {
    const { isLoggedIn, userInfo, setIsLoggedIn, setUserInfo } = useFlag();
    const [isLogout, setIsLogout] = useState(false);

    return (
        <div className={styles["top-container"]}>
            <img
                src={airlineLogo}
                alt="Etihad logo"
                className={styles["airline-logo"]}
            />
            {isLoggedIn ? (
                <div className={styles["user-section"]}>
                    <div className={styles["user-info"]}>
                        <FaUser className={styles["user-icon"]} />
                        <span className={styles["user-name"]}>
                            Xin chào, {userInfo.name || "Người dùng"}
                        </span>
                    </div>
                    <button
                        className={styles["login-button"]}
                        onClick={() => {
                            setIsLogout(true);
                        }}
                    >
                        <FaSignInAlt style={{ marginRight: "8px" }} />
                        Đăng xuất
                    </button>
                </div>
            ) : (
                <button
                    className={styles["login-button"]}
                    onClick={() => (window.location.href = "/dang-nhap")}
                >
                    <FaSignInAlt style={{ marginRight: "8px" }} />
                    Đăng nhập
                </button>
            )}
            {isLogout && (
                <div>
                    <ConfirmDialog
                        open={isLogout}
                        message={"Bạn chắc chắn muốn đăng xuất đúng không?"}
                        onConfirm={() => {
                            setIsLoggedIn(false);
                            setUserInfo({ name: "", email: "" });
                            window.location.href = "/";
                        }}
                        onCancel={() => setIsLogout(false)}
                    />
                </div>
            )}
        </div>
    );
}
