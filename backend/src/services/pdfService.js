import PDFDocument from 'pdfkit';

const CORES = {
    azul: '#1a438e',
    verde: '#15803d',
    roxo: '#7c3aed',
    preto: '#1f2937'
};

const CORES_CLARAS = {
    azul: '#d9e5f4',
    verde: '#dcfce7',
    roxo: '#ede9fe',
    preto: '#e5e7eb'
};

const AMARELO = '#fff4d1';
const MARGEM = 72;

function obterConfiguracao(prescricao) {
    return {
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
        mostrarNumeroPrescricao: false,
        ...(prescricao.configuracaoPdf?.toObject
            ? prescricao.configuracaoPdf.toObject()
            : prescricao.configuracaoPdf || {})
    };
}

function obterTamanhosFonte(configuracao) {
    if (configuracao.tamanhoFonte === 'pequena') {
        return {
            titulo: 12,
            subtitulo: 8,
            texto: 8,
            pequeno: 7
        };
    }

    if (configuracao.tamanhoFonte === 'grande') {
        return {
            titulo: 17,
            subtitulo: 12,
            texto: 12,
            pequeno: 10
        };
    }

    return {
        titulo: 14,
        subtitulo: 10,
        texto: 10,
        pequeno: 8
    };
}

function garantirEspaco(doc, altura = 90) {
    const limite = doc.page.height - doc.page.margins.bottom;

    if (doc.y + altura > limite) {
        doc.addPage();
    }
}

function adicionarFaixa(doc, texto, cor, tamanhoFonte = 9) {
    const y = doc.y;
    const largura = doc.page.width - MARGEM * 2;

    doc
        .save()
        .fillColor(cor)
        .rect(
            MARGEM,
            y,
            largura,
            28
        )
        .fill()
        .restore();

    doc
        .fillColor('#000')
        .font('Helvetica-Bold')
        .fontSize(tamanhoFonte)
        .text(
            texto,
            MARGEM + 10,
            y + 8,
            {
                width: largura - 20
            }
        );

    doc.y = y + 40;
}

function adicionarCabecalho(
    doc,
    prescricao,
    configuracao,
    corPrincipal,
    fontes
) {
    if (configuracao.mostrarCabecalhoClinica) {
        doc
            .fillColor(corPrincipal)
            .font('Helvetica-Bold')
            .fontSize(fontes.pequeno)
            .text(
                'CENTRO UNIVERSITÁRIO UNIFACISA - CLÍNICA ESCOLA',
                {
                    align: 'center'
                }
            );

        doc.moveDown(0.8);
    }

    doc
        .fillColor(corPrincipal)
        .font('Helvetica-Bold')
        .fontSize(fontes.titulo)
        .text(
            'PLANO DE EXERCÍCIOS TERAPÊUTICOS',
            {
                align: 'center'
            }
        );

    doc
        .moveDown(0.3)
        .fillColor('#000')
        .font('Helvetica')
        .fontSize(fontes.subtitulo)
        .text(
            'Orientações para Reabilitação e Bem-estar',
            {
                align: 'center'
            }
        );

    if (configuracao.mostrarNumeroPrescricao) {
        doc
            .moveDown(0.4)
            .fillColor('#64748b')
            .fontSize(fontes.pequeno)
            .text(
                `Prescrição nº ${prescricao._id}`,
                {
                    align: 'center'
                }
            );
    }

    doc.moveDown(1.5);
}

function adicionarDadosPaciente(
    doc,
    prescricao,
    configuracao,
    fontes
) {
    const paciente = prescricao.paciente;

    doc
        .fillColor('#000')
        .font('Helvetica-Bold')
        .fontSize(fontes.texto)
        .text(
            `NOME: ${paciente.nome}`
        );

    if (
        configuracao.mostrarCpf &&
        paciente.cpf
    ) {
        doc
            .moveDown(0.25)
            .font('Helvetica')
            .fontSize(fontes.pequeno)
            .text(
                `CPF: ${paciente.cpf}`
            );
    }

    if (
        configuracao.mostrarDataNascimento &&
        paciente.dataNascimento
    ) {
        doc
            .moveDown(0.25)
            .font('Helvetica')
            .fontSize(fontes.pequeno)
            .text(
                `Data de nascimento: ${new Date(
                    paciente.dataNascimento
                ).toLocaleDateString('pt-BR')}`
            );
    }

    if (
        configuracao.mostrarQueixa &&
        prescricao.queixa
    ) {
        doc
            .moveDown(0.4)
            .font('Helvetica')
            .fontSize(fontes.pequeno)
            .text(
                `Queixa principal: ${prescricao.queixa}`
            );
    }

    const linhaPacienteY = doc.y + 5;

    doc
        .moveTo(
            MARGEM,
            linhaPacienteY
        )
        .lineTo(
            doc.page.width - MARGEM,
            linhaPacienteY
        )
        .lineWidth(1)
        .stroke();

    doc.y = linhaPacienteY + 18;
}

function adicionarExerciciosClassico(
    doc,
    prescricao,
    configuracao,
    corClara,
    fontes
) {
    prescricao.exercicios.forEach(
        (item, indice) => {
            garantirEspaco(
                doc,
                configuracao.mostrarDescricao
                    ? 120
                    : 80
            );

            const exercicio = item.exercicio;

            doc
                .fillColor('#000')
                .font('Helvetica-Bold')
                .fontSize(fontes.texto)
                .text(
                    `${indice + 1}. ${exercicio.nome.toUpperCase()}`
                );

            if (configuracao.mostrarDescricao) {
                doc
                    .moveDown(0.2)
                    .font('Helvetica-Oblique')
                    .fontSize(fontes.texto)
                    .text(
                        `Como fazer: ${exercicio.descricao}`,
                        {
                            lineGap: 2
                        }
                    );
            }

            doc.moveDown(0.4);

            adicionarFaixa(
                doc,
                `Prescrição Individualizada: ${item.dosagem}`,
                corClara,
                fontes.pequeno
            );
        }
    );
}

function adicionarExerciciosCompacto(
    doc,
    prescricao,
    configuracao,
    corPrincipal,
    fontes
) {
    prescricao.exercicios.forEach(
        (item, indice) => {
            garantirEspaco(
                doc,
                configuracao.mostrarDescricao
                    ? 75
                    : 45
            );

            const exercicio = item.exercicio;

            const y = doc.y;
            const largura =
                doc.page.width - MARGEM * 2;

            doc
                .save()
                .strokeColor('#dbe3ed')
                .lineWidth(0.8)
                .roundedRect(
                    MARGEM,
                    y,
                    largura,
                    configuracao.mostrarDescricao
                        ? 62
                        : 38,
                    6
                )
                .stroke()
                .restore();

            doc
                .fillColor(corPrincipal)
                .font('Helvetica-Bold')
                .fontSize(fontes.texto)
                .text(
                    `${indice + 1}. ${exercicio.nome}`,
                    MARGEM + 10,
                    y + 8,
                    {
                        width: largura * 0.62
                    }
                );

            doc
                .fillColor('#000')
                .font('Helvetica-Bold')
                .fontSize(fontes.pequeno)
                .text(
                    item.dosagem,
                    MARGEM + largura * 0.65,
                    y + 8,
                    {
                        width: largura * 0.31,
                        align: 'right'
                    }
                );

            if (configuracao.mostrarDescricao) {
                doc
                    .fillColor('#475569')
                    .font('Helvetica')
                    .fontSize(fontes.pequeno)
                    .text(
                        exercicio.descricao,
                        MARGEM + 10,
                        y + 28,
                        {
                            width: largura - 20,
                            height: 28,
                            ellipsis: true
                        }
                    );
            }

            doc.y =
                y +
                (
                    configuracao.mostrarDescricao
                        ? 72
                        : 48
                );
        }
    );
}

function adicionarExerciciosDetalhado(
    doc,
    prescricao,
    configuracao,
    corPrincipal,
    corClara,
    fontes
) {
    prescricao.exercicios.forEach(
        (item, indice) => {
            garantirEspaco(
                doc,
                configuracao.mostrarDescricao
                    ? 145
                    : 95
            );

            const exercicio = item.exercicio;
            const largura =
                doc.page.width - MARGEM * 2;

            const yTitulo = doc.y;

            doc
                .save()
                .fillColor(corClara)
                .roundedRect(
                    MARGEM,
                    yTitulo,
                    largura,
                    30,
                    5
                )
                .fill()
                .restore();

            doc
                .fillColor(corPrincipal)
                .font('Helvetica-Bold')
                .fontSize(fontes.texto)
                .text(
                    `${indice + 1}. ${exercicio.nome}`,
                    MARGEM + 10,
                    yTitulo + 8,
                    {
                        width: largura - 20
                    }
                );

            doc.y = yTitulo + 40;

            if (configuracao.mostrarDescricao) {
                doc
                    .fillColor('#334155')
                    .font('Helvetica')
                    .fontSize(fontes.texto)
                    .text(
                        exercicio.descricao,
                        {
                            lineGap: 3
                        }
                    );

                doc.moveDown(0.6);
            }

            doc
                .fillColor('#000')
                .font('Helvetica-Bold')
                .fontSize(fontes.pequeno)
                .text(
                    'PRESCRIÇÃO'
                );

            doc
                .moveDown(0.2)
                .font('Helvetica')
                .text(
                    item.dosagem
                );

            doc.moveDown(1);
        }
    );
}

function adicionarOrientacoes(
    doc,
    prescricao,
    configuracao,
    corPrincipal,
    fontes
) {
    if (
        !configuracao.mostrarOrientacoes ||
        !prescricao.orientacoes
    ) {
        return;
    }

    garantirEspaco(
        doc,
        140
    );

    doc
        .fillColor(corPrincipal)
        .font('Helvetica-Bold')
        .fontSize(fontes.texto)
        .text(
            'RECOMENDAÇÕES E CUIDADOS',
            {
                align: 'center'
            }
        )
        .moveDown(0.6);

    const y = doc.y;
    const largura =
        doc.page.width - MARGEM * 2;

    const alturaTexto =
        doc.heightOfString(
            prescricao.orientacoes,
            {
                width: largura - 24,
                lineGap: 3
            }
        );

    const altura = Math.max(
        55,
        alturaTexto + 24
    );

    doc
        .save()
        .fillColor(AMARELO)
        .rect(
            MARGEM,
            y,
            largura,
            altura
        )
        .fill()
        .restore();

    doc
        .fillColor('#000')
        .font('Helvetica')
        .fontSize(fontes.pequeno)
        .text(
            prescricao.orientacoes,
            MARGEM + 12,
            y + 12,
            {
                width: largura - 24,
                lineGap: 3
            }
        );

    doc.y = y + altura + 68;
}

function adicionarAssinatura(
    doc,
    configuracao,
    fontes
) {
    if (!configuracao.mostrarAssinatura) {
        return;
    }

    garantirEspaco(
        doc,
        70
    );

    doc.moveDown(0.6);

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
        .lineWidth(1)
        .stroke();

    doc
        .moveDown(0.35)
        .font('Helvetica-Bold')
        .fontSize(fontes.pequeno)
        .text(
            'ASSINATURA E CARIMBO DO PROFISSIONAL',
            {
                align: 'center'
            }
        );

    if (configuracao.mostrarCabecalhoClinica) {
        doc
            .font('Helvetica-Oblique')
            .fontSize(
                Math.max(
                    7,
                    fontes.pequeno - 1
                )
            )
            .text(
                'CENTRO UNIVERSITÁRIO UNIFACISA - CLÍNICA ESCOLA',
                {
                    align: 'center'
                }
            );
    }

    const dataEmissao =
        new Intl.DateTimeFormat(
            'pt-BR'
        ).format(
            new Date()
        );

    doc
        .moveDown(0.4)
        .fillColor('#777')
        .font('Helvetica')
        .fontSize(
            Math.max(
                7,
                fontes.pequeno - 1
            )
        )
        .text(
            `Data de emissão: ${dataEmissao}`,
            {
                align: 'center'
            }
        );
}

export function gerarPdfPrescricao(
    prescricao,
    stream
) {
    const configuracao =
        obterConfiguracao(prescricao);

    const corPrincipal =
        CORES[
            configuracao.corPrincipal
        ] || CORES.azul;

    const corClara =
        CORES_CLARAS[
            configuracao.corPrincipal
        ] || CORES_CLARAS.azul;

    const fontes =
        obterTamanhosFonte(
            configuracao
        );

    const doc = new PDFDocument({
        size: 'A4',
        layout:
            configuracao.orientacao === 'landscape'
                ? 'landscape'
                : 'portrait',
        margins: {
            top: 62,
            bottom: 70,
            left: MARGEM,
            right: MARGEM
        }
    });

    doc.pipe(stream);

    adicionarCabecalho(
        doc,
        prescricao,
        configuracao,
        corPrincipal,
        fontes
    );

    adicionarDadosPaciente(
        doc,
        prescricao,
        configuracao,
        fontes
    );

    if (
        configuracao.modelo === 'compacto'
    ) {
        adicionarExerciciosCompacto(
            doc,
            prescricao,
            configuracao,
            corPrincipal,
            fontes
        );
    } else if (
        configuracao.modelo === 'detalhado'
    ) {
        adicionarExerciciosDetalhado(
            doc,
            prescricao,
            configuracao,
            corPrincipal,
            corClara,
            fontes
        );
    } else {
        adicionarExerciciosClassico(
            doc,
            prescricao,
            configuracao,
            corClara,
            fontes
        );
    }

    adicionarOrientacoes(
        doc,
        prescricao,
        configuracao,
        corPrincipal,
        fontes
    );

    adicionarAssinatura(
        doc,
        configuracao,
        fontes
    );

    doc.end();
}