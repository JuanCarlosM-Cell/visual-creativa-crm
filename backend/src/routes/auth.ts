import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            secret,
            { expiresIn: '7d' }
        );

        const { passwordHash, ...userWithoutPassword } = user;

        res.json({
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        next(error);
    }
});

// GET /auth/me
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

export default router;
