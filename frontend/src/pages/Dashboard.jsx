import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
    const [dados, setDados] = useState(null);

    const { usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/dashboard').then((response) => {
            setDados(response.data);
        });
    }, []);

    const mediaExercicios = useMemo(() => {
        if (!dados?.recentes?.length) {
            return '0.0';
        }

        const total = dados.recentes.reduce(
            (soma, prescricao) =>
                soma + (prescricao.exercicios?.length || 0),
            0
        );

        return (total / dados.recentes.length).toFixed(1);
    }, [dados]);

    if (!dados) {
        return (
            <div className="dashboard-carregando">
                Carregando...
            </div>
        );
    }

    return (
        <div className="dashboard">
            <section className="dashboard-boas-vindas">
                <div className="avatar-profissional">
                    {usuario?.nome
                        ?.charAt(0)
                        .toUpperCase()}
                </div>

                <div>
                    <h1>
                        Olá, {usuario?.nome}! 👋
                    </h1>

                    <p>
                        Seu painel UBS está pronto.
                    </p>
                </div>
            </section>

            <section className="dashboard-estatisticas">
                <div className="estatistica-card estatistica-azul">
                    <span className="estatistica-titulo">
                        TOTAL DE PRESCRIÇÕES
                    </span>

                    <strong>
                        {dados.prescricoes}
                    </strong>

                    <span className="estatistica-detalhe verde">
                        Histórico total
                    </span>
                </div>

                <div className="estatistica-card estatistica-roxo">
                    <span className="estatistica-titulo">
                        PACIENTES ATENDIDOS
                    </span>

                    <strong>
                        {dados.pacientes}
                    </strong>

                    <span className="estatistica-detalhe">
                        Nomes únicos salvos
                    </span>
                </div>

                <div className="estatistica-card estatistica-laranja">
                    <span className="estatistica-titulo">
                        MÉDIA DE EXERCÍCIOS
                    </span>

                    <strong>
                        {mediaExercicios}
                    </strong>

                    <span className="estatistica-detalhe">
                        Por prescrição
                    </span>
                </div>
            </section>

            <section className="dashboard-acao">
                <div className="dashboard-acao-conteudo">
                    <h2>
                        Pronto para começar?
                    </h2>

                    <p>
                        Crie um novo plano de exercícios personalizado
                        em poucos segundos.
                    </p>

                    <div className="dashboard-botoes">
                        <button
                            type="button"
                            className="botao-nova-prescricao"
                            onClick={() =>
                                navigate('/prescricoes/nova')
                            }
                        >
                            <span>✚</span>
                            Nova Prescrição
                        </button>

                        <button
                            type="button"
                            className="botao-historico"
                            onClick={() =>
                                navigate('/prescricoes')
                            }
                        >
                            <span>🗂️</span>
                            Ver Histórico
                        </button>
                    </div>
                </div>

                <div className="dashboard-ilustracao">
                    <div className="hospital">
                        <div className="hospital-cruz">
                            ✚
                        </div>

                        <div className="hospital-corpo">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </section>

            {dados.recentes?.length > 0 && (
                <section className="dashboard-recentes">
                    <div className="recentes-header">
                        <div>
                            <h2>
                                Prescrições recentes
                            </h2>

                            <p>
                                Últimas prescrições realizadas.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/prescricoes')
                            }
                        >
                            Ver todas
                        </button>
                    </div>

                    <div className="recentes-lista">
                        {dados.recentes.map((prescricao) => (
                            <div
                                className="prescricao-recente"
                                key={prescricao._id}
                            >
                                <div className="prescricao-recente-icone">
                                    📋
                                </div>

                                <div className="prescricao-recente-info">
                                    <strong>
                                        {prescricao.paciente?.nome ||
                                            'Paciente'}
                                    </strong>

                                    <span>
                                        {new Date(
                                            prescricao.createdAt
                                        ).toLocaleDateString(
                                            'pt-BR'
                                        )}
                                    </span>
                                </div>

                                <span className="prescricao-recente-total">
                                    {prescricao.exercicios?.length || 0}{' '}
                                    exercícios
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}