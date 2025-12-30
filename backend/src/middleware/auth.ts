import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
        }

        const token = authHeader.substring(7);
        const secret = process.env.JWT_SECRET || 'fallback-secret';

        const decoded = jwt.verify(token, secret) as {
            userId: string;
            role: string;
        };

        req.userId = decoded.userId;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.userRole !== role) {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }
        next();
    };
};
