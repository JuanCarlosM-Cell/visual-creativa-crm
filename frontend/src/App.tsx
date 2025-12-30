import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import RegisterClient from './pages/RegisterClient';
import ProjectDetail from './pages/ProjectDetail';
import AdminUsers from './pages/AdminUsers';
import SurveyForm from './pages/SurveyForm';
import SurveyDashboard from './pages/SurveyDashboard';
import Loading from './components/Loading';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
    children,
    adminOnly = false,
}) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <Loading message="Verificando autenticación..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-dark-950">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<RegisterClient />} />
                    <Route path="/encuesta" element={<SurveyForm />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Dashboard />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/clients"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <Clients />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/clients/:id"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <ClientDetail />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/:id"
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <ProjectDetail />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute adminOnly>
                                <AppLayout>
                                    <AdminUsers />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/encuestas"
                        element={
                            <ProtectedRoute adminOnly>
                                <AppLayout>
                                    <SurveyDashboard />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
