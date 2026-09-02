import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    const header = req.headers.authorization || '';

    const [tipo, token] = header.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            erro: 'Token não informado.'
        });
    }

    try {
        req.usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();
    } catch {
        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });
    }
}