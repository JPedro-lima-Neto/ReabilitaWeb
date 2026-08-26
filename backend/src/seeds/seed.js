import 'dotenv/config';
import fs from 'node:fs';
import { connectDatabase } from '../config/database.js';
import Exercicio from '../models/Exercicio.js';

await connectDatabase();

const arquivo = new URL(
    './exercicios.json',
    import.meta.url
);

const dados = JSON.parse(
    fs.readFileSync(
        arquivo,
        'utf8'
    )
);

for (const exercicio of dados) {
    await Exercicio.updateOne(
        {
            nome: exercicio.nome
        },
        {
            $set: exercicio
        },
        {
            upsert: true
        }
    );
}

console.log(
    `${dados.length} exercícios carregados.`
);

process.exit(0);