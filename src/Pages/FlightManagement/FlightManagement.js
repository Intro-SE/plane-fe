import SideBar from "../../Components/SideBar/SideBar.js";
import ManageFilter from "../../Components/Filter/Manage/ManageFilter";
import FlightCardEdit from "../../Components/Info/FlightCardEdit/FlightCardEdit";
import styles from "./FlightManagement.module.css";

export default function FlightManagement() {
  return (
    <div className={styles["flight-management-container"]}>
      <div className={styles["sidebar-container"]}>
        <SideBar />
      </div>
      <div className={styles["content-container"]}>
        <div className={styles["filter-container"]}>
          <ManageFilter />
        </div>

        {/* Add the heading and buttons section */}
        <div className={styles["action-section"]}>
          <h2 className={styles["section-title"]}>
            Danh sách các chuyến bay dựa theo bộ lọc
          </h2>
          <div className={styles["action-buttons"]}>
            <button
              className={`${styles["action-button"]} ${styles["add-button"]}`}
            >
              Thêm
            </button>
            <button
              className={`${styles["action-button"]} ${styles["delete-button"]}`}
            >
              Xóa
            </button>
            {/* <button
                            className={`${styles["action-button"]} ${styles["edit-button"]}`}
                        >
                            Sửa
                        </button> */}
          </div>
        </div>

        <div className={styles["booking-container"]}>
          <FlightCardEdit />
        </div>
      </div>
    </div>
  );
}
