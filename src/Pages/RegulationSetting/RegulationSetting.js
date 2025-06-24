import SideBar from "../../Components/SideBar/SideBar";
import TopBar from "../../Components/TopBar/TopBar";
import RegulationForm from "../../Components/Form/Regulation/RegulationForm";
import AirportDetail from "../../Components/DetailToggle/Airport/AirportDetail";
import FlightRouteDetail from "../../Components/DetailToggle/FlightRoute/FlightRouteDetail";
import TicketClassDetail from "../../Components/DetailToggle/TicketClass/TicketClassDetail";
import MessageDialog from "../../Components/Dialog/Message/MessageDialog";
import styles from "./RegulationSetting.module.css";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function RegulationSetting() {
    const [toast, setToast] = useState({
        show: false,
        type: "",
        message: "",
    });
    const [openForm, setOpenForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    // Loading Component
    const LoadingComponent = () => (
        <div className={styles["loading-overlay"]}>
            <div className={styles["loading-container"]}>
                <div className={styles["loading-spinner"]}>
                    <Loader size={32} className={styles["spinner-icon"]} />
                </div>
                <div className={styles["loading-text"]}>
                    Đang tải dữ liệu quy định ...
                </div>
                <div className={styles["loading-dots"]}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                </div>
            </div>
        </div>
    );

    // Modern Detail Loading Component
    const DetailLoadingComponent = () => (
        <div className={styles["detail-loading-overlay"]}>
            {/* Floating Particles */}
            <div className={styles["floating-particles"]}>
                <div className={styles["particle"]}></div>
                <div className={styles["particle"]}></div>
                <div className={styles["particle"]}></div>
                <div className={styles["particle"]}></div>
                <div className={styles["particle"]}></div>
            </div>

            {/* Glass Morphism Container */}
            <div className={styles["glass-loading-container"]}>
                <div className={styles["modern-spinner"]}>
                    <div className={styles["spinner-ring"]}></div>
                    <div className={styles["spinner-ring"]}></div>
                    <div className={styles["spinner-ring"]}></div>
                </div>

                <div className={styles["loading-wave"]}>
                    <div className={styles["wave-text"]}>Loading</div>
                    <div className={styles["wave-dots"]}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                {/* Gradient Progress Bar */}
                <div className={styles["progress-container"]}>
                    <div className={styles["progress-bar"]}>
                        <div className={styles["progress-fill"]}></div>
                    </div>
                </div>
            </div>

            {/* Background Glow Effect */}
            <div className={styles["glow-effect"]}></div>
        </div>
    );
    const renderForm = () => {
        switch (openForm) {
            case "airport":
                return (
                    <AirportDetail
                        setToast={setToast}
                        setLoading={setDetailLoading}
                        onClose={() => setOpenForm(null)}
                    />
                );
            case "flightRoute":
                return (
                    <FlightRouteDetail
                        setToast={setToast}
                        setLoading={setDetailLoading}
                        onClose={() => setOpenForm(null)}
                    />
                );
            case "ticketClass":
                return (
                    <TicketClassDetail
                        setToast={setToast}
                        setLoading={setDetailLoading}
                        onClose={() => setOpenForm(null)}
                    />
                );
            default:
                return null;
        }
    };
    return (
        <div className={styles["overral-page-container"]}>
            <TopBar />
            <div className={styles["regulation-container"]}>
                <div className={styles["sidebar-section"]}>
                    <SideBar />
                </div>
                <div className={styles["content-section"]}>
                    {/* Loading Overlay for Main Content */}
                    {loading && <LoadingComponent />}
                    <div className={`${loading ? styles["loading-blur"] : ""}`}>
                        <RegulationForm
                            setToast={setToast}
                            setOpenForm={setOpenForm}
                            setLoading={setLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Detail Toggle */}
            {openForm && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        {detailLoading && <DetailLoadingComponent />}
                        {renderForm()}
                    </div>
                </div>
            )}

            <MessageDialog
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
}
