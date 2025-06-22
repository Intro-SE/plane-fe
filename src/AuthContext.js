import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AUTO_LOGOUT_TIME = 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const loginTime = localStorage.getItem("loginTime");

        if (storedUser && loginTime) {
            const now = Date.now();
            const elapsed = now - parseInt(loginTime, 10);

            if (elapsed < AUTO_LOGOUT_TIME) {
                setUser(JSON.parse(storedUser));

                // Thiết lập hẹn giờ auto logout phần còn lại
                const remainingTime = AUTO_LOGOUT_TIME - elapsed;
                const timer = setTimeout(() => {
                    logout();
                }, remainingTime);

                setLoading(false);
                return () => clearTimeout(timer); // cleanup
            } else {
                logout(); // Hết hạn, tự động đăng xuất
            }
        }

        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loginTime", Date.now().toString());

        // Tự động logout sau 1 tiếng
        setTimeout(() => {
            logout();
        }, AUTO_LOGOUT_TIME);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
