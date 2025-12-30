import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

interface Survey {
    id: string;
    name?: string;
    email?: string;
    satisfactionRating: number;
    easeOfUseRating: number;
    wouldRecommend: boolean;
    comments?: string;
    createdAt: string;
}

interface Stats {
    totalSurveys: number;
    avgSatisfaction: number;
    avgEaseOfUse: number;
    recommendPercentage: number;
    recommendCount: number;
}

export default function SurveyDashboard() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [surveysRes, statsRes] = await Promise.all([
                api.get('/surveys'),
                api.get('/surveys/stats'),
            ]);
            setSurveys(surveysRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error cargando encuestas:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Cargando encuestas...</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Encuestas de Satisfacción</h1>
                    <p className="text-gray-400 mt-1">Feedback de usuarios que probaron el CRM</p>
                </div>
                <a
                    href="/encuesta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <span>🔗</span>
                    <span>Link de Encuesta</span>
                </a>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Responses */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                    >
                        <div className="text-gray-400 text-sm mb-2">Total de Respuestas</div>
                        <div className="text-4xl font-bold text-white mb-1">{stats.totalSurveys}</div>
                        <div className="text-green-400 text-sm">👥 Personas probaron el CRM</div>
                    </motion.div>

                    {/* Avg Satisfaction */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                    >
                        <div className="text-gray-400 text-sm mb-2">Satisfacción Promedio</div>
                        <div className="text-4xl font-bold text-white mb-1">{stats.avgSatisfaction}/5</div>
                        <div className="text-yellow-400 text-xl">{renderStars(Math.round(stats.avgSatisfaction))}</div>
                    </motion.div>

                    {/* Avg Ease of Use */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                    >
                        <div className="text-gray-400 text-sm mb-2">Facilidad de Uso</div>
                        <div className="text-4xl font-bold text-white mb-1">{stats.avgEaseOfUse}/5</div>
                        <div className="text-yellow-400 text-xl">{renderStars(Math.round(stats.avgEaseOfUse))}</div>
                    </motion.div>

                    {/* Recommendation */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                    >
                        <div className="text-gray-400 text-sm mb-2">Recomendación</div>
                        <div className="text-4xl font-bold text-white mb-1">{stats.recommendPercentage}%</div>
                        <div className="text-green-400 text-sm">
                            👍 {stats.recommendCount}/{stats.totalSurveys} lo recomiendan
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Recent Surveys Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-semibold text-white">Respuestas Recientes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Satisfacción
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Facilidad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Recomienda
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Comentarios
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Fecha
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {surveys.map((survey, index) => (
                                <motion.tr
                                    key={survey.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">
                                            {survey.name || 'Anónimo'}
                                        </div>
                                        {survey.email && (
                                            <div className="text-xs text-gray-400">{survey.email}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-yellow-400">
                                            {renderStars(survey.satisfactionRating)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-yellow-400">
                                            {renderStars(survey.easeOfUseRating)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${survey.wouldRecommend
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}
                                        >
                                            {survey.wouldRecommend ? '👍 Sí' : '👎 No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="text-sm text-gray-300 truncate">
                                            {survey.comments || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {new Date(survey.createdAt).toLocaleDateString('es-ES')}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
