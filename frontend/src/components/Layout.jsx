import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
    const { logout } = useAuth();

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'ativo' : ''}`
                        }
                    >
                        <span className="sidebar-icon">🏠</span>
                        <span>Início</span>
                    </NavLink>

                    <NavLink
                        to="/prescricoes/nova"
                        end
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'ativo' : ''}`
                        }
                    >
                        <span className="sidebar-icon">📁</span>
                        <span>Nova Prescrição</span>
                    </NavLink>

                    <NavLink
                        to="/prescricoes"
                        end
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'ativo' : ''}`
                        }
                    >
                        <span className="sidebar-icon">🗂️</span>
                        <span>Histórico de Prescrição</span>
                    </NavLink>

                    <NavLink
                        to="/pacientes"
                        end
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'ativo' : ''}`
                        }
                    >
                        <span className="sidebar-icon">👥</span>
                        <span>Pacientes e Relatórios</span>
                    </NavLink>
                </nav>

                <button
                    type="button"
                    className="sidebar-sair"
                    onClick={logout}
                >
                    <span>🚪</span>
                    <span>Sair</span>
                </button>
            </aside>

            <main className="conteudo-principal">
                <Outlet />
            </main>
        </div>
    );
}