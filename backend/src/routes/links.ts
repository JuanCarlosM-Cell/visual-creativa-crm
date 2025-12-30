import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// DELETE /links/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.deliverableLink.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
