import React, { useState } from 'react';
import { publicApi } from '../api';
import Loading from '../components/Loading';

const RegisterClient: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await publicApi.createLead(formData);
            setSuccess(true);
        } catch (err: any) {
            console.error('Error registrando lead:', err);
            setError(err.response?.data?.error || 'Hubo un error al enviar tus datos. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0a0a0a]">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 pointer-events-none"></div>
                <div className="bg-dark-900/40 backdrop-blur-xl border border-green-500/30 p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center animate-fadeIn relative z-10">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">¡Registro Exitoso!</h1>
                    <p className="text-gray-300 text-lg mb-8">
                        Gracias por registrarte. Hemos recibido tu información correctamente y nos pondremos en contacto contigo muy pronto.
                    </p>
                    <button
                        onClick={() => window.location.href = 'https://visualcreativa.com'} // Link de ejemplo
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Volver al sitio principal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0a0a0a]">
            {/* Background effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-2xl bg-dark-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 animate-fadeIn">
                <div className="text-center mb-10">
                    <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5 mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4 tracking-tight">
                        Bienvenido a Visual Creativa
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Completa tus datos para dar de alta tu empresa en nuestro sistema y comenzar tu próximo proyecto.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej. Juan Pérez"
                                className="w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Empresa / Marca</label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="Ej. Coca-Cola México"
                                className="w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="juan@empresa.com"
                                className="w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Teléfono (Opcional)</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+52 55 1234 5678"
                                className="w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">¿Qué necesitas? (Breve descripción)</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Cuéntanos brevemente sobre tu proyecto o necesidades..."
                            rows={3}
                            className="w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/25 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <Loading />
                        ) : (
                            <>
                                Registrar Empresa
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterClient;
