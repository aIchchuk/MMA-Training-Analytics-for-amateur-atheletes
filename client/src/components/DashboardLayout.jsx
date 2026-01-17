import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    History,
    Settings,
    LogOut,
    Swords,
    User,
    TrendingUp,
    Calendar,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadType, setUploadType] = useState('boxing');
    const [uploadDescription, setUploadDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Retrieve user data from localStorage
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const athleteName = savedUser.name || 'Athlete';
    const athleteLevel = savedUser.level || 'Amateur';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('video', uploadFile);
        formData.append('sessionType', uploadType);
        formData.append('description', uploadDescription);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/sessions/upload', {
                method: 'POST',
                headers: { 'x-auth-token': token },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setIsUploadModalOpen(false);
                setUploadFile(null);
                setUploadDescription('');
                alert("Upload successful! AI analysis started.");
                navigate('/history');
            } else {
                alert(data.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Could not connect to server.");
        } finally {
            setIsUploading(false);
        }
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { id: 'analytics', label: 'Performance', icon: <Activity size={20} />, path: '/performance' },
        { id: 'history', label: 'Session History', icon: <History size={20} />, path: '/history' },
        { id: 'profile', label: 'Athlete Profile', icon: <User size={20} />, path: '/profile' },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path || (path === '/dashboard' && location.pathname.startsWith('/sessions'));

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-900">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-400 z-[100] flex flex-col"
                    >
                        <div className="p-8 flex items-center gap-3">
                            <div className="w-10 h-10 bg-mma-blue rounded-xl flex items-center justify-center text-white">
                                <Swords size={20} />
                            </div>
                            <div onClick={() => navigate('/')} className="cursor-pointer">
                                <div className="text-white font-bold tracking-tight uppercase leading-none">MMA</div>
                                <div className="text-[10px] text-mma-blue font-black tracking-[0.2em] uppercase">Analytics</div>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 space-y-2 mt-4">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${isActive(item.path)
                                        ? 'bg-mma-blue text-white shadow-lg shadow-blue-500/20'
                                        : 'hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="p-6 border-t border-white/5">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'pl-72' : 'pl-0'}`}>
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="relative hidden md:block">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search training data..."
                                className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-mma-blue hover:-translate-y-0.5 transition-all shadow-lg active:translate-y-0"
                        >
                            New Session +
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/profile')}>
                            <div className="text-right">
                                <div className="text-xs font-black text-slate-900 uppercase">{athleteName}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">{athleteLevel} • Heavyweight</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-200 border-2 border-white shadow-sm overflow-hidden group-hover:border-mma-blue transition-all">
                                {savedUser.profileImage ? (
                                    <img src={savedUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${athleteName}`} alt="Profile" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isUploading && setIsUploadModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] p-10 w-full max-w-lg relative z-10 shadow-2xl"
                        >
                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Upload Session</h3>
                                <p className="text-slate-500 text-sm font-medium">Video will be processed by Kathmandu AI Lab</p>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-8">
                                <div
                                    className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${uploadFile ? 'border-mma-blue bg-blue-50/30' : 'border-slate-200 hover:border-mma-blue/50'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        id="video-upload"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                    />
                                    <label htmlFor="video-upload" className="cursor-pointer">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                                            <Activity size={32} className={uploadFile ? 'text-mma-blue' : 'text-slate-300'} />
                                        </div>
                                        {uploadFile ? (
                                            <div>
                                                <div className="text-slate-900 font-bold text-sm mb-1">{uploadFile.name}</div>
                                                <div className="text-slate-400 text-xs font-medium">{(uploadFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="text-slate-900 font-bold text-sm mb-1">Click to select video</div>
                                                <div className="text-slate-400 text-xs font-medium">MP4, MOV up to 500MB</div>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {/* Session Type Selection */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">Select Session Discipline</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'boxing', label: 'Boxing Shadow', icon: <Swords size={14} /> },
                                            { id: 'muay_thai', label: 'Muay Thai', icon: <Swords size={14} /> },
                                            { id: 'grappling', label: 'Grappling Drills', icon: <Activity size={14} /> },
                                            { id: 'sparring', label: 'Light Sparring', icon: <Activity size={14} /> }
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setUploadType(type.id)}
                                                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${uploadType === type.id
                                                    ? 'border-mma-blue bg-blue-50 text-mma-blue shadow-sm'
                                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${uploadType === type.id ? 'bg-mma-blue text-white' : 'bg-slate-100'}`}>
                                                    {type.icon}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-tight">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Session Description */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">Describe your session (Optional)</label>
                                    <textarea
                                        value={uploadDescription}
                                        onChange={(e) => setUploadDescription(e.target.value)}
                                        placeholder="E.g. Focus on left jab extension and hip level change..."
                                        className="w-full p-6 rounded-[28px] border-2 border-slate-100 text-sm font-medium focus:border-mma-blue transition-all outline-none bg-slate-50/30 resize-none h-32"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModalOpen(false)}
                                        disabled={isUploading}
                                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading || !uploadFile}
                                        className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-mma-blue hover:-translate-y-1 transition-all shadow-xl disabled:opacity-50 disabled:translate-y-0 disabled:bg-slate-300"
                                    >
                                        {isUploading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Uploading...
                                            </div>
                                        ) : 'Start Analysis'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
