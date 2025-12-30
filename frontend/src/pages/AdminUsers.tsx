import React, { useState, useEffect } from 'react';
import { usersApi } from '../api';
import type { User } from '../types';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' as 'admin' | 'user',
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await usersApi.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role,
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'user' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const updateData: any = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await usersApi.update(editingUser.id, updateData);
            } else {
                await usersApi.create(formData);
            }
            loadUsers();
            handleCloseModal();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Error guardando usuario');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await usersApi.delete(id);
            loadUsers();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Error eliminando usuario');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h1>
                    <p className="text-gray-400">Administra los usuarios del sistema</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary">
                    + Nuevo Usuario
                </button>
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-800">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Nombre</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Rol</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Creado</th>
                                <th className="text-right py-3 px-4 text-gray-400 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-dark-800 hover:bg-dark-800 transition-colors">
                                    <td className="py-3 px-4 text-white">{user.name}</td>
                                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-blue-500/20 text-blue-400'
                                                }`}
                                        >
                                            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-400 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleOpenModal(user)}
                                            className="text-gray-400 hover:text-white mr-3 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                        <label className="label">Email *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">
                            Contraseña {editingUser && '(dejar en blanco para no cambiar)'}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input"
                            required={!editingUser}
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="label">Rol *</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                            className="input"
                            required
                        >
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
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

export default AdminUsers;
