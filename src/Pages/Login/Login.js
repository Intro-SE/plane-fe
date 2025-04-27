import React, { useState } from "react";
import "./Login.css";
import { FaEye } from "react-icons/fa";
import googleIcon from "../../Assets/logo.png";
import airlineLogo from "../../Assets/logo.png";
import airplaneImage from "../../Assets/plane-wallpaper.jpg";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div className="login-container">
            <div className="left-panel">
                <img
                    src={airplaneImage}
                    alt="Airplane in blue sky"
                    className="background-image"
                />
            </div>

            <div className="right-panel">
                <div className="logo-container">
                    <img
                        src={airlineLogo}
                        alt="Etihad logo"
                        className="airline-logo"
                    />
                    <div className="airline-name">7 Airlines</div>
                </div>

                <div className="login-form-container">
                    <h2 className="welcome-text">Nice to see you again</h2>

                    <p className="login-label">Login</p>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Email or phone number"
                            className="form-input"
                        />
                    </div>

                    <div className="input-group">
                        <p className="input-label">Password</p>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                className="form-input"
                            />
                            <button
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FaEye />
                            </button>
                        </div>
                    </div>

                    <div className="remember-forgot-row">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button className="sign-in-button">Sign in</button>

                    <button className="google-sign-in">
                        <img
                            src={googleIcon}
                            alt="Google"
                            className="google-icon"
                        />
                        Or sign in with Google
                    </button>

                    <div className="signup-link">
                        Don't have an account? <a href="#">Sign up now</a>
                    </div>
                </div>

                <div className="footer">
                    <div className="footer-logo">
                        <img
                            src={airlineLogo}
                            alt="7 Airlines"
                            className="footer-logo-icon"
                        />
                        /7Airlines
                    </div>
                    <div className="copyright">© Perfect Login 2021</div>
                </div>
            </div>
        </div>
    );
}
