import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const createUserSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['admin', 'user']),
});

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['admin', 'user']).optional(),
});

// Todas las rutas requieren autenticación y rol admin
router.use(authenticate);
router.use(requireRole('admin'));

// GET /users
router.get('/', async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(users);
    } catch (error) {
        next(error);
    }
});

// POST /users
router.post('/', async (req, res, next) => {
    try {
        const data = createUserSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: data.role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

// PATCH /users/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateUserSchema.parse(req.body);

        if (data.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: data.email,
                    NOT: { id },
                },
            });

            if (existingUser) {
                return res.status(400).json({ error: 'El email ya está en uso' });
            }
        }

        const updateData: any = {
            name: data.name,
            email: data.email,
            role: data.role,
        };

        if (data.password) {
            updateData.passwordHash = await bcrypt.hash(data.password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// DELETE /users/:id
router.delete('/:id', async (req: AuthRequest, res, next) => {
    try {
        const { id } = req.params;

        if (id === req.userId) {
            return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
        }

        await prisma.user.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
