import React from "react";

export default function Item({ name, icon, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                fontWeight: isSelected ? "bold" : "normal",
                opacity: isSelected ? 1 : 0.6,
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "12px 15px",
                marginBottom: "8px",
                height: "40px",
                borderRadius: "6px",
                backgroundColor: isSelected ? "#FFF9C4" : "transparent",
                border: isSelected ? "2px solid #FFD700" : "none",
                transition: "all 0.2s ease",
            }}
        >
            <div
                style={{
                    marginRight: "12px",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {icon}
            </div>
            <span>{name}</span>
        </div>
    );
}
