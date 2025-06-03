import SideBar from "../../Components/SideBar/SideBar.js";
import styles from "./MainPage.module.css";
import welcomeImage from "../../Assets/welcome_img.png";
// import airlineLogo from "../../Assets/logo.png";
// import { useFlag } from "../../FlagContext";
// import { FaSignInAlt } from "react-icons/fa"; // icon đăng nhập
import TopBar from "../../Components/TopBar/TopBar.js";

export default function MainPage() {
  return (
    <div className={styles["main-page-container"]}>
      <TopBar />
      <div className={styles["main-container"]}>
        <div className={styles["sidebar-container"]}>
          <SideBar />
        </div>
        <div className={styles["main-page-image-container"]}>
          <img
            src={welcomeImage}
            alt="Welcome Poster"
            className={styles["main-image"]}
          />
        </div>
      </div>
    </div>
  );
}
