import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaEye } from "react-icons/fa";
import airlineLogo from "../../Assets/logo.png";
import airplaneImage from "../../Assets/plane-wallpaper.jpg";
import { useFlag } from "../../FlagContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useFlag(); // your flag variable
  const navigate = useNavigate();

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
          <h2 className={styles["welcome-text"]}>Nice to see you again</h2>

          <p className={styles["login-label"]}>Login</p>

          <div className={styles["input-group"]}>
            <input
              type="text"
              placeholder="Email or phone number"
              className={styles["form-input"]}
              value={username}
              onChange={(e) => setUserName(e.target.value)}
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

          <button
            className={styles["sign-in-button"]}
            onClick={async () => {
              const formData = new URLSearchParams();
              formData.append("username", username);
              formData.append("password", password);

              try {
                const response = await fetch(
                  "http://localhost:8000/api/v1/auth/login",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded", // ✅ QUAN TRỌNG
                    },
                    body: formData.toString(),
                  }
                );

                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                const accountId = result.access_token;

                if (accountId && accountId !== "#########") {
                  console.log("Login successfully!");
                  setIsLoggedIn(true);
                  // window.location.href = "/tra-cuu-chuyen-bay";
                  navigate("/tra-cuu-chuyen-bay");
                } else {
                  console.warn("Login failed!");
                }
              } catch (error) {
                console.error("Error during login:", error);
              }
            }}
          >
            Sign in
          </button>
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
          <div className={styles["copyright"]}>© Perfect Login 2021</div>
        </div>
      </div>
    </div>
  );
}
