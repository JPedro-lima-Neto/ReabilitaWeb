import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    async function enviar(e) {
        e.preventDefault();

        setErro('');

        try {
            await login(email, senha);
            navigate('/');
        } catch {
            setErro('Email ou senha inválidos.');
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-icon">
                    🩺
                </div>

                <h1>
                    Reabilitação Ativa
                </h1>

                <p className="login-subtitulo">
                    Sistema de Gestão de Prescrições
                </p>

                <form
                    className="login-form"
                    onSubmit={enviar}
                >
                    <div className="campo-login">
                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="campo-login">
                        <label>
                            Senha
                        </label>

                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) =>
                                setSenha(e.target.value)
                            }
                            required
                        />
                    </div>

                    {erro && (
                        <p className="erro-login">
                            {erro}
                        </p>
                    )}

                    <button
                        className="botao-login"
                        type="submit"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}