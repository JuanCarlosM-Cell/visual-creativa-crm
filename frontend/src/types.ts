export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
}

export interface Client {
    id: string;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    projects?: Project[];
}

export type ProjectStatus = 'Lead' | 'Cotizacion' | 'EnProduccion' | 'Entregado';

export interface Project {
    id: string;
    clientId: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    dueDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    client?: {
        id: string;
        name: string;
        company?: string;
        email?: string;
    };
    tasks?: Task[];
    links?: DeliverableLink[];
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    done: boolean;
    createdAt: string;
}

export interface DeliverableLink {
    id: string;
    projectId: string;
    label?: string;
    url: string;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
