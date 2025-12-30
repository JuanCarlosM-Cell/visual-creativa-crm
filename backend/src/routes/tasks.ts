import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Todas las rutas requieren autenticación
router.use(authenticate);

// PATCH /tasks/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, done } = req.body;

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (done !== undefined) updateData.done = done;

        const task = await prisma.task.update({
            where: { id },
            data: updateData,
        });

        res.json(task);
    } catch (error) {
        next(error);
    }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.task.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
