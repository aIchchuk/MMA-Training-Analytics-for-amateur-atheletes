import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { Swords, Menu } from 'lucide-react';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide navigation on dashboard
    if (location.pathname === '/dashboard') return null;

    return (
        <nav className="px-6 lg:px-20 py-6 flex justify-between items-center nav-blur sticky top-0 z-[100]">
            <div
                onClick={() => navigate('/')}
                className="flex items-center gap-3 cursor-pointer group"
            >
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-mma-blue transition-colors duration-300">
                    <Swords size={20} />
                </div>
                <div>
                    <div className="text-l py-1 font-bold text-slate-900 leading-none uppercase">Mixed Martial Arts</div>
                    <div className="text-xs font-bold text-mma-blue tracking-[0.3em] uppercase">Analytics</div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-10">
                <div className="flex gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="hover:text-mma-blue cursor-pointer transition-colors">Technology</span>
                    <span className="hover:text-mma-blue cursor-pointer transition-colors">Academy</span>
                    <span className="hover:text-mma-blue cursor-pointer transition-colors">Network</span>
                </div>

                <div className="flex items-center gap-2 pl-6 border-l border-slate-200">
                    {location.pathname !== '/login' && (
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-mma-blue transition-colors"
                        >
                            Login
                        </button>
                    )}
                    {location.pathname !== '/register' && (
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-slate-900 text-white px-7 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-mma-blue hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-500/20"
                        >
                            Join Now
                        </button>
                    )}
                </div>
            </div>

            <button className="md:hidden p-2 text-slate-900">
                <Menu size={24} />
            </button>
        </nav>
    );
}

function Footer() {
    const location = useLocation();

    // Hide footer on dashboard
    if (location.pathname === '/dashboard') return null;

    return (
        <footer className="py-12 border-t border-slate-200 nav-blur text-center mt-20">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                    <Swords size={16} className="text-mma-blue" />
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.4em]">MMA Analytics</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">© 2026 • Kathmandu • Advanced Biometrics</span>
            </div>
        </footer>
    );
}

function MainContent() {
    const navigate = useNavigate();

    return (
        <main>
            <Routes>
                <Route path="/" element={<LandingPage onNavigate={(page) => navigate(`/${page === 'landing' ? '' : page}`)} />} />
                <Route path="/login" element={<LoginPage onNavigate={(page) => navigate(`/${page === 'landing' ? '' : page}`)} />} />
                <Route path="/register" element={<RegisterPage onNavigate={(page) => navigate(`/${page === 'landing' ? '' : page}`)} />} />
                <Route path="/dashboard" element={<Dashboard onNavigate={(page) => navigate(`/${page === 'landing' ? '' : page}`)} />} />
            </Routes>
        </main>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-mma-bg selection:bg-mma-blue selection:text-white">
                <Navigation />
                <MainContent />
                <Footer />
            </div>
        </Router>
    );
}

export default App;