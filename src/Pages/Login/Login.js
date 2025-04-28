import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaEye } from "react-icons/fa";
import googleIcon from "../../Assets/logo.png";
import airlineLogo from "../../Assets/logo.png";
import airplaneImage from "../../Assets/plane-wallpaper.jpg";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

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
                        />
                    </div>

                    <div className={styles["input-group"]}>
                        <p className={styles["input-label"]}>Password</p>
                        <div className={styles["password-input-container"]}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                className={styles["form-input"]}
                            />
                            <button
                                className={styles["toggle-password"]}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FaEye />
                            </button>
                        </div>
                    </div>

                    <div className={styles["remember-forgot-row"]}>
                        <div className={styles["remember-me"]}>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className={styles["forgot-password"]}>
                            Forgot password?
                        </a>
                    </div>

                    <button className={styles["sign-in-button"]}>
                        Sign in
                    </button>

                    <button className={styles["google-sign-in"]}>
                        <img
                            src={googleIcon}
                            alt="Google"
                            className={styles["google-icon"]}
                        />
                        Or sign in with Google
                    </button>

                    <div className={styles["signup-link"]}>
                        Don't have an account? <a href="#">Sign up now</a>
                    </div>
                </div>

                <div className={styles["footer"]}>
                    <div className={styles["footer-logo"]}>
                        <img
                            src={airlineLogo}
                            alt="7 Airlines"
                            className={styles["footer-logo-icon"]}
                        />
                        /7Airlines
                    </div>
                    <div className={styles["copyright"]}>
                        © Perfect Login 2021
                    </div>
                </div>
            </div>
        </div>
    );
}
