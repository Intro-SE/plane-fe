import React, { useState } from "react";

export default function Item({ name, icon, isSelected, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                fontWeight: isSelected ? "bold" : "normal",
                opacity: isSelected ? 1 : isHovered ? 0.9 : 0.6,
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "12px 15px",
                marginBottom: "8px",
                height: "40px",
                borderRadius: "6px",
                backgroundColor: isSelected 
                    ? "#FFF9C4" 
                    : isHovered 
                    ? "#F5F5F5" 
                    : "transparent",
                border: isSelected ? "2px solid #FFD700" : "2px solid transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isHovered && !isSelected ? "translateX(4px)" : "translateX(0px)",
                boxShadow: isHovered 
                    ? "0 2px 8px rgba(0, 0, 0, 0.1)" 
                    : "none",
            }}
        >
            <div
                style={{
                    marginRight: "12px",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    color: isSelected ? "#FFD700" : isHovered ? "#333" : "inherit",
                    transition: "color 0.3s ease",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                }}
            >
                {icon}
            </div>
            <span
                style={{
                    transition: "color 0.3s ease",
                    color: isSelected ? "#333" : isHovered ? "#333" : "inherit",
                }}
            >
                {name}
            </span>
        </div>
    );
}
