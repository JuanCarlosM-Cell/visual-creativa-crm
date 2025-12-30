import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
                        Visual Creativa
                    </h1>
                    <p className="text-gray-400">Sistema de Gestión de Proyectos</p>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-dark-800 rounded-lg">
                        <p className="text-xs text-gray-400 mb-2">Cuentas de prueba:</p>
                        <p className="text-xs text-gray-300">Admin: admin@visualcreativa.com / Admin123!</p>
                        <p className="text-xs text-gray-300">User: user1@visualcreativa.com / User123!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
