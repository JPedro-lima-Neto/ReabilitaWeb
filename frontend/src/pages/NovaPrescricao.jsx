import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './NovaPrescricao.css';

export default function NovaPrescricao() {
    const [pacientes, setPacientes] = useState([]);
    const [exercicios, setExercicios] = useState([]);
    const [paciente, setPaciente] = useState('');
    const [itens, setItens] = useState([]);
    const [orientacoes, setOrientacoes] = useState('');
    const [queixa, setQueixa] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    const [configuracaoPdf, setConfiguracaoPdf] = useState({
        modelo: 'classico',
        mostrarDescricao: true,
        mostrarQueixa: true,
        mostrarOrientacoes: true,
        mostrarAssinatura: true,
        mostrarCpf: true,
        mostrarDataNascimento: false,
        orientacao: 'portrait',
        tamanhoFonte: 'normal',
        corPrincipal: 'azul',
        mostrarCabecalhoClinica: true,
        mostrarNumeroPrescricao: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            api.get('/pacientes'),
            api.get('/exercicios')
        ])
            .then(([pacientesResponse, exerciciosResponse]) => {
                setPacientes(pacientesResponse.data);
                setExercicios(exerciciosResponse.data);
            })
            .catch(() => {
                setErro('Não foi possível carregar os dados.');
            });
    }, []);

    const categorias = useMemo(() => {
        return [
            ...new Set(
                exercicios.map((exercicio) => exercicio.categoria)
            )
        ];
    }, [exercicios]);

    function selecionarExercicio(id) {
        setItens((itensAtuais) => {
            const existe = itensAtuais.some(
                (item) => item.exercicio === id
            );

            if (existe) {
                return itensAtuais.filter(
                    (item) => item.exercicio !== id
                );
            }

            return [
                ...itensAtuais,
                {
                    exercicio: id,
                    dosagem: '3 séries de 10 repetições'
                }
            ];
        });
    }

    function alterarDosagem(id, valor) {
        setItens((itensAtuais) =>
            itensAtuais.map((item) =>
                item.exercicio === id
                    ? {
                          ...item,
                          dosagem: valor
                      }
                    : item
            )
        );
    }

    function alterarConfiguracao(campo, valor) {
        setConfiguracaoPdf((configuracaoAtual) => ({
            ...configuracaoAtual,
            [campo]: valor
        }));
    }

    async function salvar(e) {
        e.preventDefault();

        setErro('');
        setSalvando(true);

        try {
            await api.post('/prescricoes', {
                paciente,
                exercicios: itens,
                queixa,
                orientacoes,
                configuracaoPdf
            });

            navigate('/prescricoes');
        } catch (erro) {
            setErro(
                erro.response?.data?.erro ||
                'Não foi possível salvar a prescrição.'
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="nova-prescricao">
            <div className="nova-prescricao-header">
                <div>
                    <h1>📝 Nova Prescrição</h1>

                    <p>
                        Preencha os dados abaixo para gerar o plano
                        terapêutico em PDF.
                    </p>
                </div>

                <span>
                    Configuração da prescrição
                </span>
            </div>

            <form onSubmit={salvar}>
                <section className="bloco-paciente">
                    <div className="campo-paciente">
                        <label>
                            Paciente:
                        </label>

                        <select
                            value={paciente}
                            onChange={(e) =>
                                setPaciente(e.target.value)
                            }
                            required
                        >
                            <option value="">
                                Selecione um paciente
                            </option>

                            {pacientes.map((pacienteItem) => (
                                <option
                                    key={pacienteItem._id}
                                    value={pacienteItem._id}
                                >
                                    {pacienteItem.nome} — {pacienteItem.cpf}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-paciente">
                        <label>
                            Queixa principal:
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: dor lombar"
                            value={queixa}
                            onChange={(e) =>
                                setQueixa(e.target.value)
                            }
                        />
                    </div>
                </section>

                <div className="divisor-prescricao" />

                {categorias.map((categoria) => (
                    <section
                        className="categoria-prescricao"
                        key={categoria}
                    >
                        <h2>
                            🦴 {categoria}
                        </h2>

                        <div className="grade-exercicios">
                            {exercicios
                                .filter(
                                    (exercicio) =>
                                        exercicio.categoria === categoria
                                )
                                .map((exercicio) => {
                                    const item = itens.find(
                                        (itemAtual) =>
                                            itemAtual.exercicio ===
                                            exercicio._id
                                    );

                                    return (
                                        <div
                                            className={`card-exercicio ${
                                                item ? 'selecionado' : ''
                                            }`}
                                            key={exercicio._id}
                                        >
                                            <label className="exercicio-check">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(item)}
                                                    onChange={() =>
                                                        selecionarExercicio(
                                                            exercicio._id
                                                        )
                                                    }
                                                />

                                                <strong>
                                                    {exercicio.nome}
                                                </strong>
                                            </label>

                                            <p>
                                                💡 {exercicio.descricao}
                                            </p>

                                            {item && (
                                                <div className="dosagem-area">
                                                    <label>
                                                        Prescrição:
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={item.dosagem}
                                                        onChange={(e) =>
                                                            alterarDosagem(
                                                                exercicio._id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                ))}

                <section className="orientacoes-prescricao">
                    <label>
                        Recomendações e cuidados:
                    </label>

                    <textarea
                        placeholder="Digite orientações adicionais para o paciente..."
                        value={orientacoes}
                        onChange={(e) =>
                            setOrientacoes(e.target.value)
                        }
                    />
                </section>

                <div className="divisor-prescricao" />

                <section className="configuracao-pdf">
                    <div className="configuracao-pdf-header">
                        <div>
                            <h2>
                                ⚙️ Configuração do PDF
                            </h2>

                            <p>
                                Escolha como o documento da prescrição
                                será gerado.
                            </p>
                        </div>
                    </div>

                    <div className="modelos-pdf">
                        <button
                            type="button"
                            className={`modelo-pdf-card ${
                                configuracaoPdf.modelo === 'classico'
                                    ? 'ativo'
                                    : ''
                            }`}
                            onClick={() =>
                                alterarConfiguracao(
                                    'modelo',
                                    'classico'
                                )
                            }
                        >
                            <span className="modelo-pdf-icone">
                                📄
                            </span>

                            <strong>
                                Clássico
                            </strong>

                            <small>
                                Layout tradicional e completo
                            </small>
                        </button>

                        <button
                            type="button"
                            className={`modelo-pdf-card ${
                                configuracaoPdf.modelo === 'compacto'
                                    ? 'ativo'
                                    : ''
                            }`}
                            onClick={() =>
                                alterarConfiguracao(
                                    'modelo',
                                    'compacto'
                                )
                            }
                        >
                            <span className="modelo-pdf-icone">
                                📑
                            </span>

                            <strong>
                                Compacto
                            </strong>

                            <small>
                                Ideal para prescrições com muitos exercícios
                            </small>
                        </button>

                        <button
                            type="button"
                            className={`modelo-pdf-card ${
                                configuracaoPdf.modelo === 'detalhado'
                                    ? 'ativo'
                                    : ''
                            }`}
                            onClick={() =>
                                alterarConfiguracao(
                                    'modelo',
                                    'detalhado'
                                )
                            }
                        >
                            <span className="modelo-pdf-icone">
                                📋
                            </span>

                            <strong>
                                Detalhado
                            </strong>

                            <small>
                                Mais informações clínicas no documento
                            </small>
                        </button>
                    </div>

                    <div className="configuracao-pdf-grid">
                        <div className="configuracao-pdf-bloco">
                            <h3>
                                Elementos do documento
                            </h3>

                            <label className="opcao-pdf">
                                <input
                                    type="checkbox"
                                    checked={
                                        configuracaoPdf.mostrarDescricao
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'mostrarDescricao',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <strong>
                                        Mostrar descrição dos exercícios
                                    </strong>

                                    <small>
                                        Exibe como fazer cada exercício.
                                    </small>
                                </span>
                            </label>

                            <label className="opcao-pdf">
                                <input
                                    type="checkbox"
                                    checked={
                                        configuracaoPdf.mostrarQueixa
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'mostrarQueixa',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <strong>
                                        Mostrar queixa clínica
                                    </strong>

                                    <small>
                                        Exibe a queixa principal do paciente.
                                    </small>
                                </span>
                            </label>

                            <label className="opcao-pdf">
                                <input
                                    type="checkbox"
                                    checked={
                                        configuracaoPdf.mostrarOrientacoes
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'mostrarOrientacoes',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <strong>
                                        Mostrar recomendações e cuidados
                                    </strong>

                                    <small>
                                        Exibe as orientações no final do documento.
                                    </small>
                                </span>
                            </label>

                            <label className="opcao-pdf">
                                <input
                                    type="checkbox"
                                    checked={
                                        configuracaoPdf.mostrarAssinatura
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'mostrarAssinatura',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <strong>
                                        Mostrar assinatura e carimbo
                                    </strong>

                                    <small>
                                        Adiciona área de assinatura do profissional.
                                    </small>
                                </span>
                            </label>

                            <label className="opcao-pdf">
                                <input
                                    type="checkbox"
                                    checked={
                                        configuracaoPdf.mostrarCpf
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'mostrarCpf',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <strong>
                                        Mostrar CPF do paciente
                                    </strong>

                                    <small>
                                        Exibe o CPF junto aos dados pessoais.
                                    </small>
                                </span>
                            </label>

                            <label className="opcao-pdf">
                                <input
                                    type="checkbox"
                                    checked={
                                        configuracaoPdf.mostrarDataNascimento
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'mostrarDataNascimento',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <strong>
                                        Mostrar data de nascimento
                                    </strong>

                                    <small>
                                        Disponível quando o paciente possuir esse dado.
                                    </small>
                                </span>
                            </label>
                        </div>

                        <div className="configuracao-pdf-bloco">
                            <h3>
                                Aparência do documento
                            </h3>

                            <div className="campo-configuracao-pdf">
                                <label>
                                    Orientação da página
                                </label>

                                <select
                                    value={
                                        configuracaoPdf.orientacao
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'orientacao',
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="portrait">
                                        Retrato
                                    </option>

                                    <option value="landscape">
                                        Paisagem
                                    </option>
                                </select>
                            </div>

                            <div className="campo-configuracao-pdf">
                                <label>
                                    Tamanho da fonte
                                </label>

                                <select
                                    value={
                                        configuracaoPdf.tamanhoFonte
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'tamanhoFonte',
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="pequena">
                                        Pequena
                                    </option>

                                    <option value="normal">
                                        Normal
                                    </option>

                                    <option value="grande">
                                        Grande
                                    </option>
                                </select>
                            </div>

                            <div className="campo-configuracao-pdf">
                                <label>
                                    Cor principal
                                </label>

                                <div className="cores-pdf">
                                    <button
                                        type="button"
                                        className={`cor-pdf cor-azul ${
                                            configuracaoPdf.corPrincipal ===
                                            'azul'
                                                ? 'ativo'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            alterarConfiguracao(
                                                'corPrincipal',
                                                'azul'
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className={`cor-pdf cor-verde ${
                                            configuracaoPdf.corPrincipal ===
                                            'verde'
                                                ? 'ativo'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            alterarConfiguracao(
                                                'corPrincipal',
                                                'verde'
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className={`cor-pdf cor-roxo ${
                                            configuracaoPdf.corPrincipal ===
                                            'roxo'
                                                ? 'ativo'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            alterarConfiguracao(
                                                'corPrincipal',
                                                'roxo'
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className={`cor-pdf cor-preto ${
                                            configuracaoPdf.corPrincipal ===
                                            'preto'
                                                ? 'ativo'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            alterarConfiguracao(
                                                'corPrincipal',
                                                'preto'
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <h3 className="outras-opcoes-titulo">
                                Outras opções
                            </h3>

                            <label className="opcao-pdf">
                                <input
                                    type="checkbox"
                                    checked={
                                        configuracaoPdf.mostrarCabecalhoClinica
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'mostrarCabecalhoClinica',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <strong>
                                        Usar cabeçalho com nome da clínica
                                    </strong>

                                    <small>
                                        Adiciona identificação institucional.
                                    </small>
                                </span>
                            </label>

                            <label className="opcao-pdf">
                                <input
                                    type="checkbox"
                                    checked={
                                        configuracaoPdf.mostrarNumeroPrescricao
                                    }
                                    onChange={(e) =>
                                        alterarConfiguracao(
                                            'mostrarNumeroPrescricao',
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <strong>
                                        Mostrar número da prescrição
                                    </strong>

                                    <small>
                                        Usa o identificador da prescrição no documento.
                                    </small>
                                </span>
                            </label>
                        </div>
                    </div>
                </section>

                {erro && (
                    <p className="erro-prescricao">
                        {erro}
                    </p>
                )}

                <div className="acoes-prescricao">
                    <button
                        type="button"
                        className="botao-cancelar"
                        onClick={() => navigate('/')}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="botao-salvar-prescricao"
                        disabled={
                            !paciente ||
                            !itens.length ||
                            salvando
                        }
                    >
                        {salvando
                            ? 'Salvando...'
                            : 'Salvar e Gerar Prescrição'}
                    </button>
                </div>
            </form>
        </div>
    );
}