import React, { useState, useEffect } from 'react';
import { clientsApi } from '../api';
import type { Client } from '../types';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Clients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        notes: '',
    });

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const response = await clientsApi.getAll();
            setClients(response.data);
        } catch (error) {
            console.error('Error cargando clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (client?: Client) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                company: client.company || '',
                email: client.email || '',
                phone: client.phone || '',
                notes: client.notes || '',
            });
        } else {
            setEditingClient(null);
            setFormData({ name: '', company: '', email: '', phone: '', notes: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingClient(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingClient) {
                await clientsApi.update(editingClient.id, formData);
            } else {
                await clientsApi.create(formData);
            }
            loadClients();
            handleCloseModal();
        } catch (error) {
            console.error('Error guardando cliente:', error);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
                    <p className="text-gray-400">Gestiona tus clientes y sus proyectos</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary">
                    + Nuevo Cliente
                </button>
            </div>

            {clients.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-400 mb-4">No hay clientes registrados</p>
                    <button onClick={() => handleOpenModal()} className="btn-primary">
                        Crear primer cliente
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.map((client) => (
                        <div key={client.id} className="card group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <Link to={`/clients/${client.id}`}>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                                            {client.name}
                                        </h3>
                                    </Link>
                                    {client.company && (
                                        <p className="text-sm text-gray-400">{client.company}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleOpenModal(client)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-2 mb-4">
                                {client.email && (
                                    <p className="text-sm text-gray-300 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {client.email}
                                    </p>
                                )}
                                {client.phone && (
                                    <p className="text-sm text-gray-300 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {client.phone}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-dark-800">
                                <p className="text-sm text-gray-400">
                                    {client.projects?.length || 0} proyecto(s)
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Nombre *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Empresa</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Teléfono</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label">Notas</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="input"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            {editingClient ? 'Guardar Cambios' : 'Crear Cliente'}
                        </button>
                        <button type="button" onClick={handleCloseModal} className="btn-secondary">
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
