import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { connectDatabase } from './config/database.js';
import { auth } from './middleware/auth.js';

import authRoutes from './routes/authRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import exercicioRoutes from './routes/exercicioRoutes.js';
import prescricaoRoutes from './routes/prescricaoRoutes.js';

import { dashboard } from './controllers/dashboardController.js';

import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

await connectDatabase();

const app = express();

app.use(
    cors({
        origin:
            process.env.FRONTEND_URL ||
            'http://localhost:5173'
    })
);

app.use(
    express.json()
);

app.get('/', (req, res) => {
    res.json({
        projeto: 'ReabilitaWeb',
        status: 'online',
        api: '/api',
        graphql: '/graphql'
    });
});

app.get(
    '/api/health',
    (req, res) => {
        res.json({
            status: 'ok',
            projeto: 'ReabilitaWeb'
        });
    }
);

app.use(
    '/api/auth',
    authRoutes
);

app.use(
    '/api/pacientes',
    auth,
    pacienteRoutes
);

app.use(
    '/api/exercicios',
    auth,
    exercicioRoutes
);

app.use(
    '/api/prescricoes',
    auth,
    prescricaoRoutes
);

app.get(
    '/api/dashboard',
    auth,
    dashboard
);

const apollo = new ApolloServer({
    typeDefs,
    resolvers
});

await apollo.start();

app.use(
    '/graphql',
    expressMiddleware(
        apollo,
        {
            context: async ({ req }) => {
                const authorization =
                    req.headers.authorization || '';

                const token =
                    authorization.startsWith('Bearer ')
                        ? authorization.slice(7)
                        : null;

                if (!token) {
                    throw new Error(
                        'Não autenticado'
                    );
                }

                const usuario = jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

                return {
                    usuario
                };
            }
        }
    )
);

const port =
    process.env.PORT || 3000;

app.listen(
    port,
    () => {
        console.log(
            `API em http://localhost:${port} | GraphQL em /graphql`
        );
    }
);