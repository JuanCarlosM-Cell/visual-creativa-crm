import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.errors,
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({ error: message });
};
