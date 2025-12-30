import React from 'react';
import { useAuth } from '../AuthContext';

const Topbar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-6">
            <div>
                <h2 className="text-lg font-semibold text-white">
                    Bienvenido, {user?.name}
                </h2>
                <p className="text-sm text-gray-400">
                    {new Date().toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>
            </div>

            <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Cerrar sesión</span>
            </button>
        </header>
    );
};

export default Topbar;
