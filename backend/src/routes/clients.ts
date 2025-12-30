import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

const createClientSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    company: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    notes: z.string().optional(),
});

const updateClientSchema = createClientSchema.partial();

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /clients
router.get('/', async (req, res, next) => {
    try {
        const clients = await prisma.client.findMany({
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(clients);
    } catch (error) {
        next(error);
    }
});

// GET /clients/:id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                projects: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(client);
    } catch (error) {
        next(error);
    }
});

// POST /clients
router.post('/', async (req, res, next) => {
    try {
        const data = createClientSchema.parse(req.body);

        const client = await prisma.client.create({
            data: {
                name: data.name,
                company: data.company,
                email: data.email || null,
                phone: data.phone,
                notes: data.notes,
            },
        });

        res.status(201).json(client);
    } catch (error) {
        next(error);
    }
});

// PATCH /clients/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateClientSchema.parse(req.body);

        const client = await prisma.client.update({
            where: { id },
            data: {
                name: data.name,
                company: data.company,
                email: data.email || null,
                phone: data.phone,
                notes: data.notes,
            },
        });

        res.json(client);
    } catch (error) {
        next(error);
    }
});

// DELETE /clients/:id
router.delete('/:id', requireRole('admin'), async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.client.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
