import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SurveyForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        satisfactionRating: 0,
        easeOfUseRating: 0,
        wouldRecommend: null as boolean | null,
        comments: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/surveys`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name || undefined,
                    email: formData.email || undefined,
                    satisfactionRating: formData.satisfactionRating,
                    easeOfUseRating: formData.easeOfUseRating,
                    wouldRecommend: formData.wouldRecommend,
                    comments: formData.comments || undefined,
                }),
            });

            if (response.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error enviando encuesta:', error);
            alert('Hubo un error al enviar la encuesta. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const StarRating = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
        return (
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className="text-3xl transition-all hover:scale-110"
                    >
                        {star <= value ? '⭐' : '☆'}
                    </button>
                ))}
            </div>
        );
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20"
                >
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-white mb-4">¡Gracias por tu feedback!</h2>
                    <p className="text-gray-300 mb-6">
                        Tu opinión es muy valiosa para nosotros y nos ayuda a mejorar continuamente.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Volver al inicio
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border border-white/20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Encuesta de Satisfacción</h1>
                    <p className="text-gray-300">Visual Creativa CRM</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Tu opinión nos ayuda a mejorar. Todos los campos son opcionales excepto las calificaciones.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-white mb-2">Nombre (opcional)</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            placeholder="Tu nombre"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-white mb-2">Email (opcional)</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            placeholder="tu@email.com"
                        />
                    </div>

                    {/* Satisfacción General */}
                    <div>
                        <label className="block text-white mb-2">
                            ¿Qué tan satisfecho estás con el CRM? *
                        </label>
                        <StarRating
                            value={formData.satisfactionRating}
                            onChange={(val) => setFormData({ ...formData, satisfactionRating: val })}
                        />
                    </div>

                    {/* Facilidad de Uso */}
                    <div>
                        <label className="block text-white mb-2">
                            ¿Qué tan fácil te pareció de usar? *
                        </label>
                        <StarRating
                            value={formData.easeOfUseRating}
                            onChange={(val) => setFormData({ ...formData, easeOfUseRating: val })}
                        />
                    </div>

                    {/* Recomendación */}
                    <div>
                        <label className="block text-white mb-2">¿Recomendarías este CRM? *</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, wouldRecommend: true })}
                                className={`flex-1 py-3 rounded-lg border transition-all ${formData.wouldRecommend === true
                                        ? 'bg-green-600 border-green-500 text-white'
                                        : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                                    }`}
                            >
                                👍 Sí
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, wouldRecommend: false })}
                                className={`flex-1 py-3 rounded-lg border transition-all ${formData.wouldRecommend === false
                                        ? 'bg-red-600 border-red-500 text-white'
                                        : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                                    }`}
                            >
                                👎 No
                            </button>
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div>
                        <label className="block text-white mb-2">Comentarios adicionales (opcional)</label>
                        <textarea
                            value={formData.comments}
                            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                            rows={4}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                            placeholder="Cuéntanos tu experiencia..."
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={
                            loading ||
                            formData.satisfactionRating === 0 ||
                            formData.easeOfUseRating === 0 ||
                            formData.wouldRecommend === null
                        }
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
                    >
                        {loading ? 'Enviando...' : 'Enviar Encuesta'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
