import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const C = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() =>
        JSON.parse(localStorage.getItem('usuario') || 'null')
    );

    const login = async (email, senha) => {
        const { data } = await api.post('/auth/login', {
            email,
            senha
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        setUsuario(data.usuario);
    };

    const logout = () => {
        localStorage.clear();
        setUsuario(null);
    };

    return (
        <C.Provider value={{ usuario, login, logout }}>
            {children}
        </C.Provider>
    );
}

export const useAuth = () => useContext(C);