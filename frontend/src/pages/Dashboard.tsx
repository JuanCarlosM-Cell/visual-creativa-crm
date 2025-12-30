import React, { useState, useEffect } from 'react';
import { projectsApi } from '../api';
import type { Project, ProjectStatus } from '../types';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const statusLabels: Record<ProjectStatus, string> = {
    Lead: 'Lead',
    Cotizacion: 'Cotización',
    EnProduccion: 'En Producción',
    Entregado: 'Entregado',
};

const statusGradients: Record<ProjectStatus, string> = {
    Lead: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    Cotizacion: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    EnProduccion: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    Entregado: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
};

const statusAccents: Record<ProjectStatus, string> = {
    Lead: 'bg-blue-500',
    Cotizacion: 'bg-yellow-500',
    EnProduccion: 'bg-purple-500',
    Entregado: 'bg-green-500',
};

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await projectsApi.getAll();
            setProjects(response.data);
        } catch (error) {
            console.error('Error cargando proyectos:', error);
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as ProjectStatus;
        const project = projects.find(p => p.id === draggableId);

        if (project) {
            // Optimistic update
            const updatedProjects = projects.map(p =>
                p.id === draggableId ? { ...p, status: newStatus } : p
            );
            setProjects(updatedProjects);

            try {
                await projectsApi.update(draggableId, { status: newStatus });
            } catch (error) {
                console.error('Error actualizando estado:', error);
                // Revert on error
                loadProjects();
            }
        }
    };

    const statuses: ProjectStatus[] = ['Lead', 'Cotizacion', 'EnProduccion', 'Entregado'];

    if (loading) return <Loading />;

    return (
        <div className="p-8 h-full overflow-hidden flex flex-col">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-400">Gestiona tus proyectos arrastrando las tarjetas</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-dark-800/50 backdrop-blur-md border border-dark-700/50 px-4 py-2 rounded-lg text-sm text-gray-300">
                        <span className="font-bold text-white text-lg mr-2">{projects.length}</span>
                        Proyectos Activos
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-auto pb-4">
                    {statuses.map((status) => {
                        const statusProjects = projects.filter((p) => p.status === status);

                        return (
                            <Droppable key={status} droppableId={status}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`
                                            flex flex-col h-full min-h-[500px] rounded-2xl p-4 transition-colors duration-200
                                            bg-dark-900/40 backdrop-blur-xl border border-dark-800/50
                                            ${snapshot.isDraggingOver ? 'bg-dark-800/60 ring-2 ring-indigo-500/20' : ''}
                                        `}
                                    >
                                        <div className={`
                                            flex items-center gap-3 mb-6 pb-4 border-b border-dark-700/30
                                        `}>
                                            <div className={`w-2 h-8 rounded-full ${statusAccents[status]} shadow-[0_0_10px_rgba(var(--color-accent),0.5)]`} />
                                            <div>
                                                <h2 className="font-bold text-white text-lg tracking-wide">{statusLabels[status]}</h2>
                                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                                    {statusProjects.length} Proyectos
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar min-h-[100px]">
                                            {statusProjects.map((project, index) => (
                                                <Draggable
                                                    key={project.id}
                                                    draggableId={project.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                // Mantener el estilo durante el arrastre pero sin afectar el layout original
                                                                top: 'auto',
                                                                left: 'auto'
                                                            }}
                                                            className={`
                                                                relative group
                                                                bg-gradient-to-br ${statusGradients[status]}
                                                                bg-dark-800/90 rounded-xl p-5 border border-white/5
                                                                hover:bg-dark-800 transition-all duration-200
                                                                ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-500/50 z-50 opacity-95 scale-105' : 'hover:shadow-lg hover:-translate-y-1'}
                                                            `}
                                                        >
                                                            <Link to={`/projects/${project.id}`} className="block">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <span className="text-xs font-medium text-gray-300 bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                                                                        {project.client?.name}
                                                                    </span>
                                                                    {project.dueDate && (
                                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${new Date(project.dueDate) < new Date() ? 'border-red-500/50 text-red-200 bg-red-500/10' : 'border-gray-600 text-gray-400'
                                                                            }`}>
                                                                            {new Date(project.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <h3 className="font-bold text-white text-lg mb-2 leading-tight">
                                                                    {project.name}
                                                                </h3>

                                                                {project.description && (
                                                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                                                        {project.description}
                                                                    </p>
                                                                )}
                                                            </Link>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Dashboard;
