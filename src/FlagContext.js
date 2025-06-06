import React, { createContext, useState, useContext } from "react";

// Create context
const FlagContext = createContext();

// Export hook to use in components
export const useFlag = () => useContext(FlagContext);

// Provider component
export const FlagProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // your flag variable
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: ""
  }); // thông tin người dùng

  return (
    <FlagContext.Provider value={{ isLoggedIn, setIsLoggedIn, userInfo, setUserInfo }}>
      {children}
    </FlagContext.Provider>
  );
};
