import { useState, useContext } from "react";
import styles from "./Login.module.css";
import { FaEye } from "react-icons/fa";
import airlineLogo from "../../Assets/logo.png";
import airplaneImage from "../../Assets/plane-wallpaper.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import MessageDialog from "../../Components/Dialog/Message/MessageDialog";
import { AuthContext } from "../../AuthContext";

import axios from "axios";
import { BASE_URL } from "../api";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState({
        show: false,
        type: "",
        message: "",
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);
    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/auth/login`,
                formData.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            if (
                response.data.access_token &&
                response.data.access_token !== "#########"
            ) {
                const result = response.data.employee;
                console.log("Login successfully!");
                login({
                    employee_id: result.employee_id,
                    employee_username: result.employee_username,
                    employee_password: result.employee_password,
                    employee_name: result.employee_name,
                    national_id: result.national_id,
                    phone_number: result.phone_number,
                    gender: result.gender,
                    created_date: result.created_date,
                });
                navigate(from, { replace: true });
            } else {
                console.warn("Login failed!");
                setToast({
                    show: true,
                    type: "error",
                    message: "Sai tài khoản hoặc mật khẩu!",
                });
            }
        } catch (error) {
            console.error(
                "Error during login:",
                error.response?.data || error.message,
            );
            setPassword("");
            setToast({
                show: true,
                type: "error",
                message: "Sai tài khoản hoặc mật khẩu!",
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin(e);
        }
    };

    return (
        <div className={styles["login-container"]}>
            <div className={styles["left-panel"]}>
                <img
                    src={airplaneImage}
                    alt="Airplane in blue sky"
                    className={styles["background-image"]}
                />
            </div>

            <div className={styles["right-panel"]}>
                <div className={styles["logo-container"]}>
                    <img
                        src={airlineLogo}
                        alt="Etihad logo"
                        className={styles["airline-logo"]}
                    />
                    <div className={styles["airline-name"]}>7 Airlines</div>
                </div>

                <div className={styles["login-form-container"]}>
                    <h2 className={styles["welcome-text"]}>
                        Nice to see you again
                    </h2>

                    <p className={styles["login-label"]}>Login</p>

                    <div className={styles["input-group"]}>
                        <input
                            type="text"
                            placeholder="Email or phone number"
                            className={styles["form-input"]}
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <div className={styles["input-group"]}>
                        <p className={styles["input-label"]}>Password</p>
                        <div className={styles["password-input-container"]}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                className={styles["form-input"]}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className={styles["toggle-password"]}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FaEye />
                            </button>
                        </div>
                    </div>

                    <button
                        className={styles["sign-in-button"]}
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </button>
                </div>

                <MessageDialog
                    show={toast.show}
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast({ ...toast, show: false })}
                />

                <div className={styles["footer"]}>
                    <div className={styles["footer-logo"]}>
                        <img
                            src={airlineLogo}
                            alt="7 Airlines"
                            className={styles["footer-logo-icon"]}
                        />
                        /7Airlines
                    </div>
                    {/* <div className={styles["copyright"]}>
                        © Perfect Login 2021
                    </div> */}
                </div>
            </div>
        </div>
    );
}
