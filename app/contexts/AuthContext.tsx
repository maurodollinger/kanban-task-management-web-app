'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Login } from '../lib/login';
import { Board } from '../lib/definitions';

interface AuthContextProp {
    user: { username: string, id: string },
    isLogged: boolean;
    login: (userData: { username: string }) => Promise<Board[]>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProp | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const storedUsername = typeof window !== 'undefined' ? localStorage.getItem('kanban-user') : '';
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('kanban-userid') : '';

    const [user, setUser] = useState({
        username: storedUsername || '',
        id: storedUserId || '',
    });

    const [isLogged, setIsLogged] = useState(!!storedUsername);

    const login = async (userData: { username: string }) => {
        try {
            const data = await Login(userData.username);
            const userId = data.userId;
            const boards = data.boards;

            setUser({ username: userData.username, id: userId });
            if (typeof window !== 'undefined') {
                localStorage.setItem('kanban-user', userData.username);
                localStorage.setItem('kanban-userid', userId);
            }
            setIsLogged(true);

            return boards;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    };


    const logout = () => {
        // Lógica para cerrar sesión y eliminar el usuario
        setUser({ username: '', id: '' });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('kanban-user');
            localStorage.removeItem('kanban-userid');
        }
        setIsLogged(false);
    };

    useEffect(() => {
        if (!isLogged) {
            router.push('/');
        }
    }, [isLogged, router]);

    return (
        <AuthContext.Provider value={{ user, isLogged, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
