import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientsApi, projectsApi } from '../api';
import type { Client, ProjectStatus } from '../types';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const ClientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        clientId: id || '',
        description: '',
        status: 'Lead' as ProjectStatus,
        dueDate: '',
        notes: '',
    });

    useEffect(() => {
        if (id) loadClient();
    }, [id]);

    const loadClient = async () => {
        try {
            const response = await clientsApi.getById(id!);
            setClient(response.data);
        } catch (error) {
            console.error('Error cargando cliente:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await projectsApi.create(formData);
            loadClient();
            setShowModal(false);
            setFormData({
                name: '',
                clientId: id || '',
                description: '',
                status: 'Lead',
                dueDate: '',
                notes: '',
            });
        } catch (error) {
            console.error('Error creando proyecto:', error);
        }
    };

    if (loading) return <Loading />;
    if (!client) return <div className="p-6 text-white">Cliente no encontrado</div>;

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link to="/clients" className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a Clientes
                </Link>
            </div>

            <div className="card mb-6">
                <h1 className="text-3xl font-bold text-white mb-4">{client.name}</h1>
                {client.company && <p className="text-lg text-gray-400 mb-4">{client.company}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {client.email && (
                        <div className="flex items-center gap-2 text-gray-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {client.email}
                        </div>
                    )}
                    {client.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {client.phone}
                        </div>
                    )}
                </div>

                {client.notes && (
                    <div className="p-4 bg-dark-800 rounded-lg">
                        <p className="text-sm text-gray-300">{client.notes}</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Proyectos</h2>
                <button onClick={() => setShowModal(true)} className="btn-primary">
                    + Nuevo Proyecto
                </button>
            </div>

            {!client.projects || client.projects.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-400 mb-4">No hay proyectos para este cliente</p>
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                        Crear primer proyecto
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {client.projects.map((project) => (
                        <Link key={project.id} to={`/projects/${project.id}`} className="card hover:border-red-500 transition-all">
                            <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                            <p className="text-sm text-gray-400 mb-3">{project.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs px-2 py-1 bg-dark-800 rounded text-gray-300">
                                    {project.status}
                                </span>
                                {project.dueDate && (
                                    <span className="text-xs text-gray-500">
                                        {new Date(project.dueDate).toLocaleDateString('es-ES')}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Proyecto">
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                        <label className="label">Nombre del Proyecto *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="label">Estado *</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                            className="input"
                            required
                        >
                            <option value="Lead">Lead</option>
                            <option value="Cotizacion">Cotización</option>
                            <option value="EnProduccion">En Producción</option>
                            <option value="Entregado">Entregado</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Fecha de Vencimiento</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Notas</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="input"
                            rows={2}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            Crear Proyecto
                        </button>
                        <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClientDetail;
