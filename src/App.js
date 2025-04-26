import "./App.css";
import SideBar from "./Components/SideBar/SideBar.js";
import FlightFilter from "./Components/FlightFilter/FlightFilter.js";
import TicketFilter from "./Components/TicketFilter/TicketFilter.js";
import FlightCard from "./Components/FlightCard/FlightCard.js";
import FlightBooking from "./Components/FlightBooking/FlightBooking.js";
import FlightTicket from "./Components/FlightTicket/FlightTicket.js";
import FlightInfoForm from "./Components/FlightInfoForm/FlightInfoForm.js";
import FlightInfo from "./Components/FlightInfo/FlightInfo.js";
import FlightAddForm from "./Components/FlightAddForm/FlightAddForm.js";
import FlightFixForm from "./Components/FlightFixForm/FlightFixForm.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <>
            {/* <BrowserRouter>
                <SideBar />
                <Routes>
                    <Route index element={<FlightFilter />} />
                    <Route
                        path="/tra-cuu-chuyen-bay"
                        element={<FlightBooking />}
                    />
                    <Route path="/ve-chuyen-bay" element={<FlightInfo />} />
                </Routes>
                ;
            </BrowserRouter> */}
            {/* <SideBar /> */}
            <FlightFilter />
            <TicketFilter />
            <FlightCard />
            <FlightBooking />
            <FlightTicket />
            <FlightInfoForm />
            <FlightInfo />
            <FlightAddForm />
            <FlightFixForm />
        </>
    );
}

export default App;
