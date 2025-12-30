import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsApi, tasksApi, linksApi } from '../api';
import type { Project } from '../types';
import Loading from '../components/Loading';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newLink, setNewLink] = useState({ label: '', url: '' });
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        if (id) loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            const response = await projectsApi.getById(id!);
            setProject(response.data);
        } catch (error) {
            console.error('Error cargando proyecto:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!confirm('¿Estás SEGURO de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) return;

        try {
            await projectsApi.delete(project!.id);
            navigate('/');
        } catch (error) {
            console.error('Error eliminando proyecto:', error);
            alert('Error al eliminar. Asegúrate de tener permisos de administrador.');
        }
    };

    const handleNotifyClient = async () => {
        if (!project || !project.client?.email) {
            alert('El cliente no tiene email registrado o faltan datos del proyecto');
            return;
        }

        if (!confirm(`¿Enviar correo de finalización a ${project.client.name} (${project.client.email})?`)) return;

        setSendingEmail(true);
        try {
            await projectsApi.notifyClient(project.id);
            alert('¡Correo enviado exitosamente!');
        } catch (error) {
            console.error('Error enviando notificación:', error);
            alert('Hubo un error al enviar el correo. Revisa la consola o configuración del servidor.');
        } finally {
            setSendingEmail(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            await projectsApi.createTask(id!, newTaskTitle);
            setNewTaskTitle('');
            loadProject();
        } catch (error) {
            console.error('Error creando tarea:', error);
        }
    };

    const handleToggleTask = async (taskId: string, done: boolean) => {
        if (!project) return;

        // 1. Optimistic Update (Actualizar visualmente YA)
        const updatedTasks = project.tasks?.map(t =>
            t.id === taskId ? { ...t, done: !done } : t
        ) || [];

        const previousProject = { ...project };
        setProject({ ...project, tasks: updatedTasks });

        try {
            // 2. Enviar petición en background
            await tasksApi.update(taskId, { done: !done });
            // No necesitamos recargar todo el proyecto si tuvo éxito
        } catch (error) {
            console.error('Error actualizando tarea:', error);
            // 3. Revertir si falla (Rollback)
            setProject(previousProject);
            alert('Error al actualizar la tarea. Revisa tu conexión.');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        try {
            await tasksApi.delete(taskId);
            loadProject();
        } catch (error) {
            console.error('Error eliminando tarea:', error);
        }
    };

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLink.url.trim()) return;

        try {
            await projectsApi.createLink(id!, newLink);
            setNewLink({ label: '', url: '' });
            loadProject();
        } catch (error) {
            console.error('Error creando link:', error);
        }
    };

    const handleDeleteLink = async (linkId: string) => {
        if (!confirm('¿Eliminar este link?')) return;
        try {
            await linksApi.delete(linkId);
            loadProject();
        } catch (error) {
            console.error('Error eliminando link:', error);
        }
    };

    if (loading) return <Loading />;
    if (!project) return <div className="p-6 text-white text-center text-xl mt-10">Proyecto no encontrado</div>;

    const completedTasks = project.tasks?.filter((t) => t.done).length || 0;
    const totalTasks = project.tasks?.length || 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn pb-24">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-900/40 backdrop-blur-xl p-6 rounded-2xl border border-dark-800/50 shadow-xl">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{project.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'Entregado' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            project.status === 'EnProduccion' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                            {project.status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <Link to={`/clients/${project.clientId}`} className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            {project.client?.name}
                        </Link>
                        {project.dueDate && (
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Fecha límite: {new Date(project.dueDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDeleteProject}
                        className="btn-danger p-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all border border-transparent hover:border-red-500/30"
                        title="Eliminar Proyecto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>

                    <button
                        onClick={handleNotifyClient}
                        disabled={sendingEmail}
                        className={`
                            btn-primary flex items-center gap-2 shadow-lg shadow-red-500/20 
                            transition-all font-semibold px-6 py-3
                            ${sendingEmail ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-red-500/40'}
                        `}
                    >
                        {sendingEmail ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Notificar Cliente
                            </>
                        )}
                    </button>
                </div>

                {project.description && (
                    <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mb-6 font-light hidden md:block">{project.description}</p>
                )}

                <div className="flex flex-wrap gap-6 text-sm text-gray-400 border-t border-white/5 pt-6 hidden md:flex">
                    {project.dueDate && (
                        <div className="flex items-center gap-2 bg-dark-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="text-gray-300">Vence:</span>
                            <span className="font-medium text-white">{new Date(project.dueDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-dark-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-gray-300">Creado:</span>
                        <span className="font-medium text-white">{new Date(project.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tareas */}
                <div className="bg-dark-900/40 backdrop-blur-xl border border-dark-800/50 rounded-2xl p-6 h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            Checklist
                        </h2>
                        <span className="bg-dark-800 px-3 py-1 rounded-full text-sm font-medium text-white border border-dark-700">
                            {completedTasks} / {totalTasks}
                        </span>
                    </div>

                    {totalTasks > 0 && (
                        <div className="mb-6">
                            <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleAddTask} className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Agregar nueva tarea..."
                                className="input flex-1 bg-dark-800/50 border-dark-700 focus:border-green-500 focus:ring-green-500/20"
                            />
                            <button type="submit" className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg border border-dark-700 transition-colors font-medium">
                                +
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3">
                        {!project.tasks || project.tasks.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-dark-800 rounded-xl">
                                <p className="text-gray-500">No hay tareas pendientes</p>
                            </div>
                        ) : (
                            project.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-4 p-4 bg-dark-800/40 border border-dark-700/50 rounded-xl group hover:border-dark-600 transition-all"
                                >
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={task.done}
                                            onChange={() => handleToggleTask(task.id, task.done)}
                                            className="w-6 h-6 rounded border-dark-600 text-green-500 focus:ring-green-500 bg-dark-900 cursor-pointer peer"
                                        />
                                    </div>
                                    <span className={`flex-1 font-medium transition-colors ${task.done ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                                        {task.title}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-2 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Links de Entregables */}
                <div className="bg-dark-900/40 backdrop-blur-xl border border-dark-800/50 rounded-2xl p-6 h-fit">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        </div>
                        Entregables
                    </h2>

                    <form onSubmit={handleAddLink} className="mb-6 space-y-3 p-4 bg-dark-800/30 rounded-xl border border-dark-700/30">
                        <input
                            type="text"
                            value={newLink.label}
                            onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                            placeholder="Etiqueta (ej. Carpeta Final)"
                            className="input w-full bg-dark-900/50 text-sm"
                        />
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                placeholder="Pegar URL aquí..."
                                className="input flex-1 bg-dark-900/50 text-sm"
                                required
                            />
                            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20">
                                AgregarLINK
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3">
                        {!project.links || project.links.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-dark-800 rounded-xl">
                                <p className="text-gray-500">No hay links de entrega</p>
                            </div>
                        ) : (
                            project.links.map((link) => (
                                <div
                                    key={link.id}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-dark-800 to-dark-800/50 rounded-xl group border border-transparent hover:border-blue-500/30 transition-all"
                                >
                                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {link.label && (
                                            <p className="text-sm font-semibold text-white mb-0.5">{link.label}</p>
                                        )}
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-400 hover:text-blue-300 truncate block hover:underline"
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteLink(link.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-2 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
