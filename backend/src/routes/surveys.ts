import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

const createSurveySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    satisfactionRating: z.number().int().min(1).max(5),
    easeOfUseRating: z.number().int().min(1).max(5),
    wouldRecommend: z.boolean(),
    comments: z.string().optional(),
});

// POST /surveys - Submit survey (PUBLIC, no auth required)
router.post('/', async (req, res, next) => {
    try {
        const data = createSurveySchema.parse(req.body);

        const survey = await prisma.survey.create({
            data: {
                name: data.name,
                email: data.email,
                satisfactionRating: data.satisfactionRating,
                easeOfUseRating: data.easeOfUseRating,
                wouldRecommend: data.wouldRecommend,
                comments: data.comments,
            },
        });

        res.status(201).json({
            message: '¡Gracias por tu feedback!',
            survey
        });
    } catch (error) {
        next(error);
    }
});

// GET /surveys - Get all surveys (ADMIN only)
router.get('/', authenticate, requireRole('admin'), async (req, res, next) => {
    try {
        const surveys = await prisma.survey.findMany({
            orderBy: { createdAt: 'desc' },
        });

        res.json(surveys);
    } catch (error) {
        next(error);
    }
});

// GET /surveys/stats - Get statistics (ADMIN only)
router.get('/stats', authenticate, requireRole('admin'), async (req, res, next) => {
    try {
        const totalSurveys = await prisma.survey.count();

        const surveys = await prisma.survey.findMany();

        const avgSatisfaction = surveys.length > 0
            ? surveys.reduce((sum, s) => sum + s.satisfactionRating, 0) / surveys.length
            : 0;

        const avgEaseOfUse = surveys.length > 0
            ? surveys.reduce((sum, s) => sum + s.easeOfUseRating, 0) / surveys.length
            : 0;

        const recommendCount = surveys.filter(s => s.wouldRecommend).length;
        const recommendPercentage = surveys.length > 0
            ? (recommendCount / surveys.length) * 100
            : 0;

        res.json({
            totalSurveys,
            avgSatisfaction: Number(avgSatisfaction.toFixed(1)),
            avgEaseOfUse: Number(avgEaseOfUse.toFixed(1)),
            recommendPercentage: Number(recommendPercentage.toFixed(1)),
            recommendCount,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
