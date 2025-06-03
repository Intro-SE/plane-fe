import Item from "./Item.js";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFlag } from "../../FlagContext";

import {
  TbLayoutDashboard,
  TbReportMoney,
  TbSettingsCode,
} from "react-icons/tb";
import { PiAirplaneInFlight } from "react-icons/pi";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { LuTicketCheck } from "react-icons/lu";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useFlag();

  let items = [];

  // TEST
  // isLoggedIn = true;
  // END TEST

  if (!isLoggedIn) {
    items = [
      {
        name: "Trang chủ",
        icon: <TbLayoutDashboard />,
        path: "/",
      },
      {
        name: "Tra cứu chuyến bay",
        icon: <PiAirplaneInFlight />,
        path: "/tra-cuu-chuyen-bay",
      },
    ];
  } else {
    items = [
      {
        name: "Trang chủ",
        icon: <TbLayoutDashboard />,
        path: "/",
      },
      {
        name: "Tra cứu chuyến bay",
        icon: <PiAirplaneInFlight />,
        path: "/tra-cuu-chuyen-bay",
      },
      {
        name: "Quản lý chuyến bay",
        icon: <MdOutlineAirplaneTicket />,
        path: "/quan-ly-chuyen-bay",
      },
      {
        name: "Quản lý phiếu đặt chỗ",
        icon: <IoTicketOutline />,
        path: "/quan-ly-phieu-dat-cho",
      },
      {
        name: "Quản lý vé chuyến bay",
        icon: <LuTicketCheck />,
        path: "/quan-ly-ve-chuyen-bay",
      },
      {
        name: "Báo cáo doanh thu",
        icon: <TbReportMoney />,
        path: "/bao-cao-doanh-thu",
      },
      {
        name: "Thay đổi quy định",
        icon: <TbSettingsCode />,
        path: "/thay-doi-quy-dinh",
      },
    ];
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "230px",
        padding: "10px",
      }}
    >
      {items.map((item, index) => (
        <Item
          key={index}
          name={item.name}
          icon={item.icon}
          isSelected={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        />
      ))}
    </div>
  );
}
