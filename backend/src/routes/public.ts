import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createLeadSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    company: z.string().min(1, 'El nombre de la empresa es requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    notes: z.string().optional(),
});

// POST /public/leads - Crear un cliente desde formulario público
router.post('/leads', async (req, res) => {
    try {
        const data = createLeadSchema.parse(req.body);

        // Verificar si ya existe
        const existingClient = await prisma.client.findFirst({
            where: { email: data.email }
        });

        if (existingClient) {
            return res.status(400).json({ error: 'Este correo ya está registrado en nuestra base de datos.' });
        }

        const newClient = await prisma.client.create({
            data: {
                name: data.name,
                company: data.company,
                email: data.email,
                phone: data.phone,
                notes: `[Registro Web] ${data.notes || ''}`
            }
        });

        res.status(201).json(newClient);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Error al procesar el registro' });
    }
});

export default router;
