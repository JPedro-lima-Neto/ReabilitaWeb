import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import './Prescricoes.css';

export default function Prescricoes() {
    const [lista, setLista] = useState([]);
    const [busca, setBusca] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        api.get('/prescricoes')
            .then((response) => {
                setLista(response.data);
            })
            .finally(() => {
                setCarregando(false);
            });
    }, []);

    const listaFiltrada = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        if (!termo) {
            return lista;
        }

        return lista.filter((prescricao) => {
            const nome =
                prescricao.paciente?.nome?.toLowerCase() || '';

            const cpf =
                prescricao.paciente?.cpf?.toLowerCase() || '';

            const data = new Date(
                prescricao.createdAt
            ).toLocaleDateString('pt-BR');

            return (
                nome.includes(termo) ||
                cpf.includes(termo) ||
                data.includes(termo)
            );
        });
    }, [lista, busca]);

    function nomesExercicios(prescricao) {
        const nomes = prescricao.exercicios
            ?.map((item) => item.exercicio?.nome)
            .filter(Boolean);

        if (!nomes?.length) {
            return 'Nenhum exercício';
        }

        return nomes.join(', ');
    }

    async function baixarPdf(id) {
        const response = await api.get(
            `/prescricoes/${id}/pdf`,
            {
                responseType: 'blob'
            }
        );

        const url = URL.createObjectURL(response.data);

        const link = document.createElement('a');

        link.href = url;
        link.download = 'prescricao.pdf';

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);
    }

    return (
        <div className="historico-page">
            <section className="historico-card">
                <header className="historico-header">
                    <h1>
                        🗂️ Histórico de Prescrição
                    </h1>

                    <p>
                        Visualize as prescrições geradas para seus pacientes.
                    </p>
                </header>

                <div className="historico-busca">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome do paciente ou data..."
                        value={busca}
                        onChange={(e) =>
                            setBusca(e.target.value)
                        }
                    />

                    <button type="button">
                        Buscar
                    </button>
                </div>

                {carregando ? (
                    <p className="historico-carregando">
                        Carregando prescrições...
                    </p>
                ) : (
                    <div className="historico-tabela-wrapper">
                        <table className="historico-tabela">
                            <thead>
                                <tr>
                                    <th>PACIENTE</th>
                                    <th>DATA DE EMISSÃO</th>
                                    <th>EXERCÍCIOS</th>
                                    <th>AÇÃO</th>
                                </tr>
                            </thead>

                            <tbody>
                                {listaFiltrada.map((prescricao) => (
                                    <tr key={prescricao._id}>
                                        <td>
                                            <strong>
                                                {prescricao.paciente?.nome ||
                                                    'Paciente não encontrado'}
                                            </strong>

                                            {prescricao.paciente?.cpf && (
                                                <small>
                                                    {prescricao.paciente.cpf}
                                                </small>
                                            )}
                                        </td>

                                        <td>
                                            {new Date(
                                                prescricao.createdAt
                                            ).toLocaleString(
                                                'pt-BR',
                                                {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                }
                                            )}
                                        </td>

                                        <td>
                                            <div className="texto-exercicios">
                                                {nomesExercicios(
                                                    prescricao
                                                )}
                                            </div>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="botao-pdf"
                                                onClick={() =>
                                                    baixarPdf(
                                                        prescricao._id
                                                    )
                                                }
                                            >
                                                📥 Baixar PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {!listaFiltrada.length && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="historico-vazio"
                                        >
                                            Nenhuma prescrição encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}