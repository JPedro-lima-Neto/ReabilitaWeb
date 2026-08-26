import PDFDocument from 'pdfkit';

const AZUL = '#1a438e';
const AZUL_CLARO = '#eef4ff';
const CINZA = '#64748b';
const CINZA_CLARO = '#f8fafc';
const VERMELHO_CLARO = '#fff1f2';
const VERDE_CLARO = '#f0fdf4';
const MARGEM = 60;

function garantirEspaco(doc, altura = 100) {
    const limite =
        doc.page.height -
        doc.page.margins.bottom;

    if (doc.y + altura > limite) {
        doc.addPage();
    }
}

function formatarData(data) {
    if (!data) {
        return '-';
    }

    return new Intl.DateTimeFormat(
        'pt-BR'
    ).format(
        new Date(data)
    );
}

function formatarDataHora(data) {
    if (!data) {
        return '-';
    }

    return new Intl.DateTimeFormat(
        'pt-BR',
        {
            dateStyle: 'short',
            timeStyle: 'short'
        }
    ).format(
        new Date(data)
    );
}

function normalizarTexto(texto) {
    return String(texto || '')
        .trim()
        .toLowerCase()
        .replace(/[.,;:!?]/g, '')
        .replace(/\s+/g, ' ');
}

function calcularResumo(
    paciente,
    prescricoes
) {
    const frequenciaExercicios = {};
    const frequenciaQueixas = {};

    let totalExercicios = 0;

    prescricoes.forEach(
        (prescricao) => {
            prescricao.exercicios?.forEach(
                (item) => {
                    const nome =
                        item.exercicio?.nome;

                    if (!nome) {
                        return;
                    }

                    totalExercicios += 1;

                    frequenciaExercicios[nome] =
                        (
                            frequenciaExercicios[nome] ||
                            0
                        ) + 1;
                }
            );

            if (prescricao.queixa) {
                const chave =
                    normalizarTexto(
                        prescricao.queixa
                    );

                if (!chave) {
                    return;
                }

                if (
                    !frequenciaQueixas[chave]
                ) {
                    frequenciaQueixas[chave] = {
                        texto:
                            prescricao.queixa,
                        quantidade: 0
                    };
                }

                frequenciaQueixas[
                    chave
                ].quantidade += 1;
            }
        }
    );

    const exerciciosMaisUsados =
        Object.entries(
            frequenciaExercicios
        )
            .map(
                ([nome, quantidade]) => ({
                    nome,
                    quantidade
                })
            )
            .sort(
                (a, b) =>
                    b.quantidade -
                    a.quantidade
            );

    const queixasMaisFrequentes =
        Object.values(
            frequenciaQueixas
        ).sort(
            (a, b) =>
                b.quantidade -
                a.quantidade
        );

    const datas = prescricoes
        .map(
            (prescricao) =>
                new Date(
                    prescricao.createdAt
                )
        )
        .sort(
            (a, b) => a - b
        );

    return {
        atendimentos:
            prescricoes.length,

        totalExercicios,

        exerciciosDiferentes:
            Object.keys(
                frequenciaExercicios
            ).length,

        primeiroAtendimento:
            datas.length
                ? datas[0]
                : null,

        ultimoAtendimento:
            datas.length
                ? datas[
                      datas.length - 1
                  ]
                : null,

        exerciciosMaisUsados,

        queixasMaisFrequentes,

        dataCadastro:
            paciente.createdAt
    };
}

function adicionarTitulo(
    doc,
    paciente
) {
    doc
        .fillColor(AZUL)
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(
            'CENTRO UNIVERSITÁRIO UNIFACISA - CLÍNICA ESCOLA',
            {
                align: 'center'
            }
        );

    doc
        .moveDown(0.7)
        .fontSize(17)
        .text(
            'RELATÓRIO DE ACOMPANHAMENTO FISIOTERAPÊUTICO',
            {
                align: 'center'
            }
        );

    doc.moveDown(1.5);

    doc
        .fillColor('#111827')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(
            `Paciente: ${paciente.nome}`
        );

    doc
        .moveDown(0.25)
        .font('Helvetica')
        .fontSize(9)
        .text(
            `CPF: ${paciente.cpf}`
        );

    if (paciente.dataNascimento) {
        doc
            .moveDown(0.25)
            .text(
                `Data de nascimento: ${formatarData(
                    paciente.dataNascimento
                )}`
            );
    }

    if (paciente.telefone) {
        doc
            .moveDown(0.25)
            .text(
                `Telefone: ${paciente.telefone}`
            );
    }

    const y = doc.y + 10;

    doc
        .moveTo(
            MARGEM,
            y
        )
        .lineTo(
            doc.page.width - MARGEM,
            y
        )
        .strokeColor('#cbd5e1')
        .lineWidth(1)
        .stroke();

    doc.y = y + 20;
}

function adicionarCardResumo(
    doc,
    titulo,
    valor,
    x,
    y,
    largura
) {
    doc
        .save()
        .fillColor(CINZA_CLARO)
        .roundedRect(
            x,
            y,
            largura,
            65,
            8
        )
        .fill()
        .restore();

    doc
        .fillColor(CINZA)
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(
            titulo,
            x + 10,
            y + 12,
            {
                width:
                    largura - 20,
                align: 'center'
            }
        );

    doc
        .fillColor('#111827')
        .font('Helvetica-Bold')
        .fontSize(17)
        .text(
            String(valor),
            x + 10,
            y + 31,
            {
                width:
                    largura - 20,
                align: 'center'
            }
        );
}

function adicionarResumo(
    doc,
    resumo
) {
    garantirEspaco(
        doc,
        160
    );

    doc
        .fillColor(AZUL)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(
            'RESUMO DO ACOMPANHAMENTO'
        );

    doc.moveDown(0.8);

    const larguraTotal =
        doc.page.width -
        MARGEM * 2;

    const gap = 10;

    const largura =
        (
            larguraTotal -
            gap * 2
        ) / 3;

    const y = doc.y;

    adicionarCardResumo(
        doc,
        'ATENDIMENTOS',
        resumo.atendimentos,
        MARGEM,
        y,
        largura
    );

    adicionarCardResumo(
        doc,
        'EXERCÍCIOS PRESCRITOS',
        resumo.totalExercicios,
        MARGEM +
            largura +
            gap,
        y,
        largura
    );

    adicionarCardResumo(
        doc,
        'EXERCÍCIOS DIFERENTES',
        resumo.exerciciosDiferentes,
        MARGEM +
            (
                largura +
                gap
            ) *
                2,
        y,
        largura
    );

    doc.y = y + 85;

    doc
        .fillColor('#334155')
        .font('Helvetica')
        .fontSize(9)
        .text(
            `Primeiro atendimento: ${formatarData(
                resumo.primeiroAtendimento
            )}`
        );

    doc
        .moveDown(0.3)
        .text(
            `Último atendimento: ${formatarData(
                resumo.ultimoAtendimento
            )}`
        );

    doc
        .moveDown(0.3)
        .text(
            `Paciente cadastrado em: ${formatarData(
                resumo.dataCadastro
            )}`
        );

    doc.moveDown(1.5);
}

function adicionarQueixas(
    doc,
    resumo
) {
    garantirEspaco(
        doc,
        120
    );

    doc
        .fillColor(AZUL)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(
            'QUEIXAS REGISTRADAS'
        );

    doc.moveDown(0.7);

    if (
        resumo.queixasMaisFrequentes
            .length === 0
    ) {
        doc
            .fillColor(CINZA)
            .font('Helvetica')
            .fontSize(9)
            .text(
                'Nenhuma queixa clínica foi registrada.'
            );

        doc.moveDown(1.5);

        return;
    }

    resumo.queixasMaisFrequentes.forEach(
        (item) => {
            garantirEspaco(
                doc,
                55
            );

            const y = doc.y;
            const largura =
                doc.page.width -
                MARGEM * 2;

            doc
                .save()
                .fillColor(
                    VERMELHO_CLARO
                )
                .roundedRect(
                    MARGEM,
                    y,
                    largura,
                    45,
                    6
                )
                .fill()
                .restore();

            doc
                .fillColor('#991b1b')
                .font(
                    'Helvetica-Bold'
                )
                .fontSize(9)
                .text(
                    item.texto,
                    MARGEM + 12,
                    y + 9,
                    {
                        width:
                            largura -
                            24
                    }
                );

            doc
                .fillColor(CINZA)
                .font('Helvetica')
                .fontSize(8)
                .text(
                    `Registrada em ${item.quantidade} atendimento${
                        item.quantidade !==
                        1
                            ? 's'
                            : ''
                    }`,
                    MARGEM + 12,
                    y + 25
                );

            doc.y = y + 55;
        }
    );

    doc.moveDown(0.8);
}

function adicionarExerciciosMaisUsados(
    doc,
    resumo
) {
    garantirEspaco(
        doc,
        150
    );

    doc
        .fillColor(AZUL)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(
            'EXERCÍCIOS MAIS UTILIZADOS'
        );

    doc.moveDown(0.8);

    if (
        resumo.exerciciosMaisUsados
            .length === 0
    ) {
        doc
            .fillColor(CINZA)
            .font('Helvetica')
            .fontSize(9)
            .text(
                'Nenhum exercício registrado.'
            );

        doc.moveDown(1.5);

        return;
    }

    resumo.exerciciosMaisUsados
        .slice(0, 10)
        .forEach(
            (item, indice) => {
                garantirEspaco(
                    doc,
                    32
                );

                doc
                    .fillColor(
                        '#111827'
                    )
                    .font(
                        'Helvetica-Bold'
                    )
                    .fontSize(9)
                    .text(
                        `${indice + 1}. ${item.nome}`
                    );

                doc
                    .moveDown(0.15)
                    .fillColor(CINZA)
                    .font('Helvetica')
                    .fontSize(8)
                    .text(
                        `Prescrito em ${item.quantidade} atendimento${
                            item.quantidade !==
                            1
                                ? 's'
                                : ''
                        }`
                    );

                doc.moveDown(0.7);
            }
        );

    doc.moveDown(0.8);
}

function adicionarLinhaDoTempo(
    doc,
    prescricoes
) {
    garantirEspaco(
        doc,
        100
    );

    doc
        .fillColor(AZUL)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(
            'EVOLUÇÃO DOS ATENDIMENTOS'
        );

    doc.moveDown(1);

    prescricoes.forEach(
        (
            prescricao,
            indice
        ) => {
            garantirEspaco(
                doc,
                170
            );

            const largura =
                doc.page.width -
                MARGEM * 2;

            const y = doc.y;

            doc
                .save()
                .fillColor(
                    AZUL_CLARO
                )
                .roundedRect(
                    MARGEM,
                    y,
                    largura,
                    32,
                    6
                )
                .fill()
                .restore();

            doc
                .fillColor(AZUL)
                .font(
                    'Helvetica-Bold'
                )
                .fontSize(9)
                .text(
                    `Atendimento ${
                        indice + 1
                    } — ${formatarDataHora(
                        prescricao.createdAt
                    )}`,
                    MARGEM + 12,
                    y + 10
                );

            doc.y = y + 45;

            if (
                prescricao.queixa
            ) {
                doc
                    .fillColor(
                        '#991b1b'
                    )
                    .font(
                        'Helvetica-Bold'
                    )
                    .fontSize(9)
                    .text(
                        'Queixa / Sintomas'
                    );

                doc
                    .moveDown(0.2)
                    .fillColor(
                        '#111827'
                    )
                    .font(
                        'Helvetica'
                    )
                    .fontSize(9)
                    .text(
                        prescricao.queixa,
                        {
                            lineGap: 2
                        }
                    );

                doc.moveDown(0.7);
            }

            doc
                .fillColor(AZUL)
                .font(
                    'Helvetica-Bold'
                )
                .fontSize(9)
                .text(
                    'Exercícios prescritos'
                );

            doc.moveDown(0.3);

            prescricao.exercicios?.forEach(
                (item) => {
                    const exercicio =
                        item.exercicio;

                    doc
                        .fillColor(
                            '#111827'
                        )
                        .font(
                            'Helvetica'
                        )
                        .fontSize(8)
                        .text(
                            `• ${
                                exercicio?.nome ||
                                'Exercício'
                            } — ${
                                item.dosagem
                            }`,
                            {
                                indent: 5,
                                lineGap: 2
                            }
                        );
                }
            );

            if (
                prescricao.orientacoes
            ) {
                doc.moveDown(0.8);

                const yOrientacao =
                    doc.y;

                const alturaTexto =
                    doc.heightOfString(
                        prescricao.orientacoes,
                        {
                            width:
                                largura -
                                30
                        }
                    );

                const altura =
                    Math.max(
                        42,
                        alturaTexto +
                            24
                    );

                doc
                    .save()
                    .fillColor(
                        VERDE_CLARO
                    )
                    .roundedRect(
                        MARGEM,
                        yOrientacao,
                        largura,
                        altura,
                        6
                    )
                    .fill()
                    .restore();

                doc
                    .fillColor(
                        '#166534'
                    )
                    .font(
                        'Helvetica-Bold'
                    )
                    .fontSize(8)
                    .text(
                        'Orientações ao paciente',
                        MARGEM + 12,
                        yOrientacao +
                            9
                    );

                doc
                    .fillColor(
                        '#334155'
                    )
                    .font(
                        'Helvetica'
                    )
                    .fontSize(8)
                    .text(
                        prescricao.orientacoes,
                        MARGEM + 12,
                        yOrientacao +
                            22,
                        {
                            width:
                                largura -
                                24
                        }
                    );

                doc.y =
                    yOrientacao +
                    altura;
            }

            doc.moveDown(1.4);
        }
    );
}

function adicionarRodape(
    doc
) {
    garantirEspaco(
        doc,
        150
    );

    doc.moveDown(8);

    const centro =
        doc.page.width / 2;

    doc
        .moveTo(
            centro - 170,
            doc.y
        )
        .lineTo(
            centro + 170,
            doc.y
        )
        .strokeColor('#111827')
        .lineWidth(1)
        .stroke();

    doc
        .moveDown(0.4)
        .fillColor('#111827')
        .font(
            'Helvetica-Bold'
        )
        .fontSize(8)
        .text(
            'ASSINATURA E CARIMBO DO PROFISSIONAL',
            {
                align: 'center'
            }
        );

    doc
        .font(
            'Helvetica-Oblique'
        )
        .fontSize(7)
        .text(
            'CENTRO UNIVERSITÁRIO UNIFACISA - CLÍNICA ESCOLA',
            {
                align: 'center'
            }
        );

    doc
        .moveDown(0.4)
        .fillColor(CINZA)
        .font('Helvetica')
        .fontSize(7)
        .text(
            `Relatório emitido em ${formatarData(
                new Date()
            )}`,
            {
                align: 'center'
            }
        );
}

export function gerarRelatorioPaciente(
    paciente,
    prescricoes,
    stream
) {
    const doc =
        new PDFDocument({
            size: 'A4',
            margins: {
                top: 55,
                bottom: 65,
                left: MARGEM,
                right: MARGEM
            }
        });

    doc.pipe(stream);

    const prescricoesOrdenadas =
        [...prescricoes].sort(
            (a, b) =>
                new Date(
                    a.createdAt
                ) -
                new Date(
                    b.createdAt
                )
        );

    const resumo =
        calcularResumo(
            paciente,
            prescricoesOrdenadas
        );

    adicionarTitulo(
        doc,
        paciente
    );

    adicionarResumo(
        doc,
        resumo
    );

    adicionarQueixas(
        doc,
        resumo
    );

    adicionarExerciciosMaisUsados(
        doc,
        resumo
    );

    adicionarLinhaDoTempo(
        doc,
        prescricoesOrdenadas
    );

    adicionarRodape(
        doc
    );

    doc.end();
}