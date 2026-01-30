import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../lib/axios';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        if (storedToken) {
            setToken(storedToken);
            api.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
        api.defaults.headers.common['Authorization'] = `Token ${newToken}`;
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('adminToken');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
