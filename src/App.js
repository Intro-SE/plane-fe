import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Pages/MainPage/MainPage";
import Login from "./Pages/Login/Login";
import FlightLookup from "./Pages/FlightLookup/FlightLookup";
import FlightManagement from "./Pages/FlightManagement/FlightManagement";
import BookingManagement from "./Pages/BookingManagement/BookingManagement";
import Regulation from "./Pages/RegulationSetting/RegulationSetting";
import TicketManagement from "./Pages/TicketManagement/TicketManagement";

import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/dang-nhap" element={<Login />} />
                    <Route
                        path="/tra-cuu-chuyen-bay"
                        element={<FlightLookup />}
                    />
                    <Route
                        path="/quan-ly-chuyen-bay"
                        element={
                            <PrivateRoute>
                                <FlightManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/quan-ly-phieu-dat-cho"
                        element={
                            <PrivateRoute>
                                <BookingManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/quan-ly-ve-chuyen-bay"
                        element={
                            <PrivateRoute>
                                <TicketManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/thay-doi-quy-dinh"
                        element={
                            <PrivateRoute>
                                <Regulation />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
