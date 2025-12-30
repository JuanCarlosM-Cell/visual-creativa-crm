import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from './api';
import type { User, LoginCredentials } from './types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authApi
                .me()
                .then((res) => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const response = await authApi.login(credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
