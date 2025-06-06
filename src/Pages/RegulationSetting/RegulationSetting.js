import React from "react";
import SideBar from "../../Components/SideBar/SideBar";
import FixRule from "../../Components/Form/FixRule/FixRule";
import TopBar from "../../Components/TopBar/TopBar";
import styles from "./RegulationSetting.module.css"; // Chuyển sang module.css

export default function RegulationSetting() {
    return (
        <div className={styles["overral-page-container"]}>
            <TopBar />
            <div className={styles["regulation-container"]}>
                <div className={styles["sidebar-section"]}>
                    <SideBar />
                </div>
                <div className={styles["content-section"]}>
                    <FixRule />
                </div>
            </div>
        </div>
    );
}
