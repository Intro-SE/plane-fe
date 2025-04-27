import React, { useState } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import wallpaper from "../../Assets/plane-wallpaper.jpg";
import logo from "../../Assets/logo.png";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login data:", formData);
        // Handle login logic here
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <img src={wallpaper} alt="Airplane in sky" />
            </div>

            <div className="login-form-container">
                <div className="logo-section">
                    <img src={logo} alt="Etihad Logo" className="logo" />
                    <span className="airlines-text">7 Airlines</span>
                </div>

                <h1 className="welcome-text">Nice to see you again</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-label">Login</div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="email"
                            placeholder="Email or phone number"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <div className="password-label">Password</div>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                            <span
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <div className="form-options">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="remember-checkbox"
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <a href="#forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="sign-in-button">
                        Sign in
                    </button>

                    <div className="or-divider">
                        <span className="or-text">or</span>
                    </div>

                    <button type="button" className="google-button">
                        <FcGoogle className="google-icon" />
                        Sign in with Google
                    </button>

                    <div className="signup-prompt">
                        Don't have an account?{" "}
                        <a href="#signup" className="signup-link">
                            Sign up now
                        </a>
                    </div>
                </form>

                <div className="footer">
                    <div className="footer-logo">
                        <img
                            src={logo}
                            alt="Etihad Mini Logo"
                            className="mini-logo"
                        />
                        <span className="mini-text">7Airlines</span>
                    </div>
                    <div className="copyright">© Perfect Login 2021</div>
                </div>
            </div>
        </div>
    );
}
