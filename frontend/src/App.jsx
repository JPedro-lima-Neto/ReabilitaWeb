import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Prescricoes from './pages/Prescricoes';
import NovaPrescricao from './pages/NovaPrescricao';

export default function App() {
    const { usuario } = useAuth();

    if (!usuario) {
        return (
            <Routes>
                <Route
                    path="*"
                    element={<Login />}
                />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/pacientes"
                    element={<Pacientes />}
                />

                <Route
                    path="/prescricoes"
                    element={<Prescricoes />}
                />

                <Route
                    path="/prescricoes/nova"
                    element={<NovaPrescricao />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Route>
        </Routes>
    );
}