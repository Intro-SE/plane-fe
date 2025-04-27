import SideBar from "../../Components/SideBar/SideBar.js";
import LookupFilter from "../../Components/Filter/Lookup/LookupFilter";
import FlightCard from "../../Components/Info/FlightCard/FlightCard.js";
import "./FlightLookup.css";

export default function FlightLookup() {
    return (
        <div className="flight-lookup-container">
            <div className="sidebar-container">
                <SideBar />
            </div>
            <div className="main-content">
                <div className="filter-container">
                    <LookupFilter />
                </div>
                <div className="card-container">
                    <FlightCard />
                </div>
            </div>
        </div>
    );
}
