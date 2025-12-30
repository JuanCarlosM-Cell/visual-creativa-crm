import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import clientsRoutes from './routes/clients';
import projectsRoutes from './routes/projects';
import tasksRoutes from './routes/tasks';
import linksRoutes from './routes/links';
import publicRoutes from './routes/public';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Visual Creativa CRM API' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/clients', clientsRoutes);
app.use('/projects', projectsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/links', linksRoutes);
app.use('/public', publicRoutes);

// Error handler (debe ser el último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
