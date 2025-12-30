import React from 'react';
import { useAuth } from '../AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
            <div className="p-6 border-b border-dark-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    Visual Creativa
                </h1>
                <p className="text-sm text-gray-400 mt-1">CRM</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    to="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/')
                            ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                            : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="font-medium">Dashboard</span>
                </Link>

                <Link
                    to="/clients"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/clients')
                            ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                            : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Clientes</span>
                </Link>

                {isAdmin && (
                    <Link
                        to="/admin/users"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/users')
                                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                                : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="font-medium">Usuarios</span>
                    </Link>
                )}
            </nav>

            <div className="p-4 border-t border-dark-800">
                <div className="flex items-center gap-3 px-4 py-3 bg-dark-800 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
