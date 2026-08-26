import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import './Pacientes.css';

export default function Pacientes() {
    const [pacientes, setPacientes] = useState([]);
    const [prescricoes, setPrescricoes] = useState([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
    const [busca, setBusca] = useState('');
    const [carregando, setCarregando] = useState(true);

    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [erroCadastro, setErroCadastro] = useState('');

    function carregarDados() {
        return Promise.all([
            api.get('/pacientes'),
            api.get('/prescricoes')
        ]).then(([pacientesResponse, prescricoesResponse]) => {
            setPacientes(pacientesResponse.data);
            setPrescricoes(prescricoesResponse.data);

            if (
                !pacienteSelecionado &&
                pacientesResponse.data.length > 0
            ) {
                setPacienteSelecionado(
                    pacientesResponse.data[0]
                );
            }
        });
    }

    useEffect(() => {
        carregarDados().finally(() => {
            setCarregando(false);
        });
    }, []);

    const pacientesFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        if (!termo) {
            return pacientes;
        }

        return pacientes.filter((paciente) => {
            const nomePaciente =
                paciente.nome?.toLowerCase() || '';

            const cpfPaciente =
                paciente.cpf?.toLowerCase() || '';

            return (
                nomePaciente.includes(termo) ||
                cpfPaciente.includes(termo)
            );
        });
    }, [pacientes, busca]);

    const prescricoesPaciente = useMemo(() => {
        if (!pacienteSelecionado) {
            return [];
        }

        return prescricoes.filter(
            (prescricao) =>
                prescricao.paciente?._id ===
                pacienteSelecionado._id
        );
    }, [prescricoes, pacienteSelecionado]);

    const totalExercicios = useMemo(() => {
        return prescricoesPaciente.reduce(
            (total, prescricao) =>
                total +
                (prescricao.exercicios?.length || 0),
            0
        );
    }, [prescricoesPaciente]);

    const dataEntrada = useMemo(() => {
        if (!pacienteSelecionado?.createdAt) {
            return '-';
        }

        return new Date(
            pacienteSelecionado.createdAt
        ).toLocaleDateString('pt-BR');
    }, [pacienteSelecionado]);

    async function cadastrarPaciente(e) {
        e.preventDefault();

        setErroCadastro('');

        try {
            const response = await api.post(
                '/pacientes',
                {
                    nome,
                    cpf
                }
            );

            setPacientes((listaAtual) => [
                ...listaAtual,
                response.data
            ]);

            setPacienteSelecionado(response.data);

            setNome('');
            setCpf('');
            setMostrarCadastro(false);
        } catch (erro) {
            setErroCadastro(
                erro.response?.data?.erro ||
                'Não foi possível cadastrar o paciente.'
            );
        }
    }

        async function gerarRelatorioCompleto() {
            if (!pacienteSelecionado) {
                return;
            }

            try {
                const response = await api.get(
                    `/pacientes/${pacienteSelecionado._id}/relatorio`,
                    {
                        responseType: 'blob'
                    }
                );

                const url =
                    URL.createObjectURL(
                        response.data
                    );

                const link =
                    document.createElement(
                        'a'
                    );

                const nomeArquivo =
                    pacienteSelecionado.nome
                        .trim()
                        .replace(/\s+/g, '-')
                        .toLowerCase();

                link.href = url;

                link.download =
                    `relatorio-${nomeArquivo}.pdf`;

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

                URL.revokeObjectURL(
                    url
                );
            } catch {
                alert(
                    'Não foi possível gerar o relatório completo.'
                );
            }
        }

    async function baixarPdfPrescricao(id, nomePaciente) {
        try {
            const response = await api.get(
                `/prescricoes/${id}/pdf`,
                {
                    responseType: 'blob'
                }
            );

            const url = URL.createObjectURL(
                response.data
            );

            const link =
                document.createElement('a');

            const nomeArquivo = nomePaciente
                .trim()
                .replace(/\s+/g, '-')
                .toLowerCase();

            link.href = url;
            link.download =
                `prescricao-${nomeArquivo}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);
        } catch {
            alert(
                'Não foi possível baixar a prescrição.'
            );
        }
    }

    if (carregando) {
        return (
            <div className="pacientes-carregando">
                Carregando...
            </div>
        );
    }

    return (
        <div className="pacientes-page">
            <aside className="filtro-pacientes">
                <div className="filtro-header">
                    <h2>
                        👥 Filtro de Pacientes
                    </h2>

                    <p>
                        Selecione um paciente para ver prontuário
                        e emitir relatórios.
                    </p>
                </div>

                <button
                    type="button"
                    className="botao-novo-paciente"
                    onClick={() =>
                        setMostrarCadastro(
                            (valorAtual) => !valorAtual
                        )
                    }
                >
                    + Novo Paciente
                </button>

                {mostrarCadastro && (
                    <form
                        className="cadastro-paciente"
                        onSubmit={cadastrarPaciente}
                    >
                        <div>
                            <label>
                                Nome completo
                            </label>

                            <input
                                type="text"
                                placeholder="Digite o nome"
                                value={nome}
                                onChange={(e) =>
                                    setNome(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div>
                            <label>
                                CPF
                            </label>

                            <input
                                type="text"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) =>
                                    setCpf(e.target.value)
                                }
                                required
                            />
                        </div>

                        {erroCadastro && (
                            <p className="erro-cadastro-paciente">
                                {erroCadastro}
                            </p>
                        )}

                        <div className="acoes-cadastro-paciente">
                            <button
                                type="button"
                                className="botao-cancelar-cadastro"
                                onClick={() => {
                                    setMostrarCadastro(false);
                                    setNome('');
                                    setCpf('');
                                    setErroCadastro('');
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="botao-salvar-paciente"
                            >
                                Cadastrar
                            </button>
                        </div>
                    </form>
                )}

                <div className="campo-busca-paciente">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CPF..."
                        value={busca}
                        onChange={(e) =>
                            setBusca(e.target.value)
                        }
                    />

                    <button type="button">
                        🔍
                    </button>
                </div>

                <div className="lista-pacientes">
                    {pacientesFiltrados.map((paciente) => (
                        <button
                            type="button"
                            key={paciente._id}
                            className={`paciente-item ${
                                pacienteSelecionado?._id ===
                                paciente._id
                                    ? 'ativo'
                                    : ''
                            }`}
                            onClick={() =>
                                setPacienteSelecionado(
                                    paciente
                                )
                            }
                        >
                            <span className="paciente-item-icon">
                                👤
                            </span>

                            <span className="paciente-item-dados">
                                <strong>
                                    {paciente.nome}
                                </strong>

                                <small>
                                    CPF: {paciente.cpf}
                                </small>
                            </span>
                        </button>
                    ))}

                    {!pacientesFiltrados.length && (
                        <div className="nenhum-paciente">
                            Nenhum paciente encontrado.
                        </div>
                    )}
                </div>
            </aside>

            <section className="historico-clinico">
                {!pacienteSelecionado ? (
                    <div className="selecione-paciente">
                        Selecione um paciente para visualizar
                        o histórico.
                    </div>
                ) : (
                    <>
                        <header className="historico-clinico-header">
                            <div>
                                <h1>
                                    HISTÓRICO E EVOLUÇÃO CLÍNICA
                                </h1>

                                <h3>
                                    Paciente:{' '}
                                    {pacienteSelecionado.nome}
                                </h3>

                                <p>
                                    CPF único:{' '}
                                    {pacienteSelecionado.cpf}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="botao-imprimir-historico"
                                onClick={gerarRelatorioCompleto}
                            >
                                📄 Gerar Relatório Completo
                            </button>
                        </header>

                        <div className="linha-separadora" />

                        <section className="resumo-paciente">
                            <div className="resumo-card">
                                <span>
                                    Consultas Registradas
                                </span>

                                <strong>
                                    {prescricoesPaciente.length}
                                </strong>
                            </div>

                            <div className="resumo-card">
                                <span>
                                    Total de Exercícios Passados
                                </span>

                                <strong>
                                    {totalExercicios}
                                </strong>
                            </div>

                            <div className="resumo-card">
                                <span>
                                    Data de Entrada
                                </span>

                                <strong className="data-resumo">
                                    {dataEntrada}
                                </strong>
                            </div>
                        </section>

                        <section className="timeline-section">
                            <h2>
                                📋 Linha do Tempo de Atendimentos
                            </h2>

                            {prescricoesPaciente.length === 0 ? (
                                <div className="sem-atendimentos">
                                    Nenhuma prescrição registrada
                                    para este paciente.
                                </div>
                            ) : (
                                <div className="timeline-lista">
                                    {prescricoesPaciente.map(
                                        (prescricao) => (
                                            <article
                                                className="atendimento-card"
                                                key={prescricao._id}
                                            >
                                                <header className="atendimento-header">
                                                    <strong>
                                                        🗓️ Atendimento:{' '}
                                                        {new Date(
                                                            prescricao.createdAt
                                                        ).toLocaleString(
                                                            'pt-BR',
                                                            {
                                                                dateStyle:
                                                                    'short',
                                                                timeStyle:
                                                                    'short'
                                                            }
                                                        )}
                                                    </strong>

                                                    <div className="acoes-atendimento">
                                                        <span>
                                                            Prescrição Registrada
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className="botao-pdf-atendimento"
                                                            onClick={() =>
                                                                baixarPdfPrescricao(
                                                                    prescricao._id,
                                                                    pacienteSelecionado.nome
                                                                )
                                                            }
                                                        >
                                                            📥 Baixar PDF
                                                        </button>
                                                    </div>
                                                </header>

                                                <div className="atendimento-conteudo">
                                                    <p className="queixa">
                                                        ⚠️{' '}
                                                        <strong>
                                                            Queixa Clínica /
                                                            Sintomas:
                                                        </strong>{' '}
                                                        {prescricao.queixa ||
                                                            'Não informada'}
                                                    </p>

                                                    <div className="exercicios-prescritos">
                                                        <span>
                                                            🏋️
                                                        </span>

                                                        <p>
                                                            <strong>
                                                                Exercícios
                                                                Prescritos:
                                                            </strong>{' '}
                                                            {prescricao.exercicios
                                                                ?.map(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        `${item.exercicio?.nome || 'Exercício'} (${item.dosagem})`
                                                                )
                                                                .join(
                                                                    ', '
                                                                )}
                                                        </p>
                                                    </div>

                                                    <div className="orientacoes-atendimento">
                                                        💡{' '}
                                                        <strong>
                                                            Orientações ao
                                                            Paciente:
                                                        </strong>{' '}
                                                        {prescricao.orientacoes ||
                                                            'Nenhuma orientação adicional.'}
                                                    </div>
                                                </div>
                                            </article>
                                        )
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </section>
        </div>
    );
}