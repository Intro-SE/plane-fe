import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import FlightLookup from "./Pages/FlightLookup/FlightLookup";
import FlightManagement from "./Pages/FlightManagement/FlightManagement";
import BookingManagement from "./Pages/BookingManagement/BookingManagement";
import Regulation from "./Pages/RegulationSetting/RegulationSetting";
import TicketManagement from "./Pages/TicketManagement/TicketManagement";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/tra-cuu-chuyen-bay"
                        element={<FlightLookup />}
                    />
                    <Route
                        path="/quan-ly-chuyen-bay"
                        element={<FlightManagement />}
                    />
                    <Route
                        path="/quan-ly-phieu-dat-cho"
                        element={<BookingManagement />}
                    />
                    <Route
                        path="/quan-ly-ve-chuyen-bay"
                        element={<TicketManagement />}
                    />
                    <Route path="/thay-doi-quy-dinh" element={<Regulation />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
