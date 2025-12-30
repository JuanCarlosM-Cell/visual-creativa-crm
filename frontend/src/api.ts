import axios from 'axios';
import type {
    User,
    Client,
    Project,
    Task,
    DeliverableLink,
    LoginCredentials,
    AuthResponse,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const authApi = {
    login: (credentials: LoginCredentials) =>
        api.post<AuthResponse>('/auth/login', credentials),
    me: () => api.get<User>('/auth/me'),
};

// Users
export const usersApi = {
    getAll: () => api.get<User[]>('/users'),
    create: (data: Partial<User> & { password: string }) =>
        api.post<User>('/users', data),
    update: (id: string, data: Partial<User> & { password?: string }) =>
        api.patch<User>(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
};

// Clients
export const clientsApi = {
    getAll: () => api.get<Client[]>('/clients'),
    getById: (id: string) => api.get<Client>(`/clients/${id}`),
    create: (data: Partial<Client>) => api.post<Client>('/clients', data),
    update: (id: string, data: Partial<Client>) =>
        api.patch<Client>(`/clients/${id}`, data),
    delete: (id: string) => api.delete(`/clients/${id}`),
};

// Projects
export const projectsApi = {
    getAll: (params?: { status?: string; clientId?: string }) =>
        api.get<Project[]>('/projects', { params }),
    getById: (id: string) => api.get<Project>(`/projects/${id}`),
    create: (data: Partial<Project>) => api.post<Project>('/projects', data),
    update: (id: string, data: Partial<Project>) =>
        api.patch<Project>(`/projects/${id}`, data),
    delete: (id: string) => api.delete(`/projects/${id}`),
    createTask: (projectId: string, title: string) =>
        api.post<Task>(`/projects/${projectId}/tasks`, { title }),
    createLink: (projectId: string, data: { label?: string; url: string }) =>
        api.post<DeliverableLink>(`/projects/${projectId}/links`, data),
    notifyClient: (projectId: string) =>
        api.post<{ message: string }>(`/projects/${projectId}/notify`),
};

// Tasks
export const tasksApi = {
    update: (id: string, data: { title?: string; done?: boolean }) =>
        api.patch<Task>(`/tasks/${id}`, data),
    delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Links
export const linksApi = {
    delete: (id: string) => api.delete(`/links/${id}`),
};

// Public
export const publicApi = {
    createLead: (data: { name: string; company: string; email: string; phone?: string; notes?: string }) =>
        api.post('/public/leads', data),
};

export default api;
