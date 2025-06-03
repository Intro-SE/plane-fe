import styles from "./TopBar.module.css";
import airlineLogo from "../../Assets/logo.png";
import { useFlag } from "../../FlagContext";
import { FaSignInAlt } from "react-icons/fa";

export default function TopBar() {
  const { isLoggedIn } = useFlag();

  return (
    <div className={styles["top-container"]}>
      <img
        src={airlineLogo}
        alt="Etihad logo"
        className={styles["airline-logo"]}
      />
      {isLoggedIn ? (
        <button
          className={styles["login-button"]}
          onClick={() => (window.location.href = "/")}
        >
          <FaSignInAlt style={{ marginRight: "8px" }} />
          Đăng xuất
        </button>
      ) : (
        <button
          className={styles["login-button"]}
          onClick={() => (window.location.href = "/dang-nhap")}
        >
          <FaSignInAlt style={{ marginRight: "8px" }} />
          Đăng nhập
        </button>
      )}
    </div>
  );
}
