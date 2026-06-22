import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if a user session already exists in localStorage on app startup
    useEffect(() => {
        const storedUser = localStorage.getItem('cms_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Handle User Login
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('cms_user', JSON.stringify(userData));
    };

    // Handle User Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('cms_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom Hook for effortless context consumption across pages
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be utilized strictly within an AuthProvider layer');
    }
    return context;
};