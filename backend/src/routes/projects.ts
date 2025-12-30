import { Router } from 'express';
import { PrismaClient, ProjectStatus } from '@prisma/client';
import { z } from 'zod';
import { sendProjectCompletionEmail } from '../services/emailService';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const createProjectSchema = z.object({
    clientId: z.string().uuid('ID de cliente inválido'),
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().optional(),
    status: z.enum(['Lead', 'Cotizacion', 'EnProduccion', 'Entregado']),
    dueDate: z.string().optional(),
    notes: z.string().optional(),
});

const updateProjectSchema = createProjectSchema.partial();

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /projects
router.get('/', async (req, res, next) => {
    try {
        const { status, clientId } = req.query;

        const where: any = {};
        if (status) where.status = status as ProjectStatus;
        if (clientId) where.clientId = clientId as string;

        const projects = await prisma.project.findMany({
            where,
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        company: true,
                    },
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        done: true,
                    },
                },
                links: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(projects);
    } catch (error) {
        next(error);
    }
});

// GET /projects/:id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                client: true,
                tasks: {
                    orderBy: { createdAt: 'asc' },
                },
                links: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
});

// POST /projects
router.post('/', async (req, res, next) => {
    try {
        const data = createProjectSchema.parse(req.body);

        const project = await prisma.project.create({
            data: {
                clientId: data.clientId,
                name: data.name,
                description: data.description,
                status: data.status as ProjectStatus,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                notes: data.notes,
            },
            include: {
                client: true,
            },
        });

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
});

// PATCH /projects/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = updateProjectSchema.parse(req.body);

        const updateData: any = {
            clientId: data.clientId,
            name: data.name,
            description: data.description,
            status: data.status as ProjectStatus | undefined,
            notes: data.notes,
        };

        if (data.dueDate !== undefined) {
            updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
        }

        const project = await prisma.project.update({
            where: { id },
            data: updateData,
            include: {
                client: true,
                tasks: true,
                links: true,
            },
        });

        res.json(project);
    } catch (error) {
        next(error);
    }
});

// DELETE /projects/:id
router.delete('/:id', requireRole('admin'), async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.project.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// POST /projects/:id/tasks
router.post('/:id/tasks', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'El título es requerido' });
        }

        const task = await prisma.task.create({
            data: {
                projectId: id,
                title,
            },
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
});

// POST /projects/:id/links
router.post('/:id/links', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { label, url } = req.body;

        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'La URL es requerida' });
        }

        const link = await prisma.deliverableLink.create({
            data: {
                projectId: id,
                label,
                url,
            },
        });

        res.status(201).json(link);
    } catch (error) {
        next(error);
    }
});

// Notificar cliente vía Email
router.post('/:id/notify', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                client: true,
                links: true
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        if (!project.client?.email) {
            return res.status(400).json({ error: 'El cliente no tiene un email registrado' });
        }

        // Si no hay credenciales de email configuradas, simulamos éxito en desarrollo
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ EMAIL_USER o EMAIL_PASS no configurados. Simulando envío.');
            return res.json({ message: 'Simulación: Correo enviado correctamente (Configura .env para envío real)' });
        }

        await sendProjectCompletionEmail(
            project.client.email,
            project.client.name,
            project.name,
            project.links.map(l => ({
                ...l,
                label: l.label || undefined
            }))
        );

        res.json({ message: 'Correo enviado correctamente al cliente' });
    } catch (error) {
        console.error('Error en notificación:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
});

export default router;
