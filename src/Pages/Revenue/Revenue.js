import SideBar from "../../Components/SideBar/SideBar";
import TopBar from "../../Components/TopBar/TopBar";
import RevenueReport from "../../Components/Form/RevenueReport/RevenueReport";
import styles from "./Revenue.module.css";

export default function Revenue() {
    return (
        <div className={styles["overral-page-container"]}>
            <TopBar />
            <div className={styles["regulation-container"]}>
                <div className={styles["sidebar-section"]}>
                    <SideBar />
                </div>
                <div className={styles["content-section"]}>
                    <RevenueReport />
                </div>
            </div>
        </div>
    );
}
