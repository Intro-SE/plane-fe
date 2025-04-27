import React from "react";
import { IoPeopleOutline, IoBusinessOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuClock } from "react-icons/lu";
import "./FlightInfo.css";
import { TbBuildingAirport } from "react-icons/tb";

export default function FlightInfo() {
    return (
        <div className="flight-info-card">
            <div className="flight-header">
                <h2>VJ-123</h2>

                <div className="flight-metadata">
                    <div className="metadata-item">
                        <MdOutlineCalendarMonth className="icon" />
                        <span>31/12/2025</span>
                    </div>
                    <div className="metadata-item">
                        <span className="icon">
                            <IoPeopleOutline />
                        </span>
                        <span>200</span>
                    </div>
                </div>
            </div>

            <div className="flight-routes">
                <div className="route-row">
                    <div className="time-column">
                        <LuClock className="icon" />
                        <div className="time">9:00</div>
                    </div>

                    <div className="vertical-divider-container">
                        <div className="vertical-divider"></div>
                    </div>

                    <div className="city-column">
                        <span className="icon">
                            <IoBusinessOutline />
                        </span>
                        <div className="city">TPHCM</div>
                    </div>

                    <div className="airport-column">
                        <TbBuildingAirport className="icon" />
                        <div className="airport">Tân Sơn Nhất</div>
                    </div>
                </div>

                <div className="horizontal-divider"></div>

                <div className="route-row">
                    <div className="time-column">
                        <LuClock className="icon" />
                        <div className="time">11:00</div>
                    </div>

                    <div className="vertical-divider-container">
                        <div className="vertical-divider"></div>
                    </div>

                    <div className="city-column">
                        <span className="icon">
                            <IoBusinessOutline />
                        </span>
                        <div className="city">Hà Nội</div>
                    </div>

                    <div className="airport-column">
                        <TbBuildingAirport className="icon" />
                        <div className="airport">Nội Bài</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
