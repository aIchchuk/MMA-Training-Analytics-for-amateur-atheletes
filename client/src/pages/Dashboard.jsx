import React, { useState, useEffect } from 'react';
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

const Dashboard = ({ onNavigate }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [sessions, setSessions] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Retrieve user data from localStorage
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const athleteName = savedUser.name || 'Athlete';
    const athleteLevel = savedUser.level || 'Amateur';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onNavigate('landing');
    };

    // Fetch user sessions
    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/sessions', {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            if (response.ok) setSessions(data);
        } catch (error) {
            console.error("Fetch sessions error:", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'history' || activeTab === 'overview') {
            fetchSessions();
        }
    }, [activeTab]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('video', uploadFile);

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
                fetchSessions();
                alert("Upload successful! AI analysis started.");
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
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'analytics', label: 'Performance', icon: <Activity size={20} /> },
        { id: 'history', label: 'Session History', icon: <History size={20} /> },
        { id: 'profile', label: 'Athlete Profile', icon: <User size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const stats = [
        { label: 'Total Saved', value: sessions.length, change: 'Lifetime', icon: <History className="text-blue-500" /> },
        { label: 'Completed', value: sessions.filter(s => s.status === 'completed').length, change: 'Analyzed', icon: <TrendingUp className="text-emerald-500" /> },
        { label: 'Pending', value: sessions.filter(s => s.status === 'pending' || s.status === 'analyzing').length, change: 'Processing', icon: <Calendar className="text-orange-500" /> },
    ];

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
                            <div>
                                <div className="text-white font-bold tracking-tight uppercase leading-none">MMA</div>
                                <div className="text-[10px] text-mma-blue font-black tracking-[0.2em] uppercase">Analytics</div>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 space-y-2 mt-4">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === item.id
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
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right">
                                <div className="text-xs font-black text-slate-900 uppercase">{athleteName}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">{athleteLevel} • Heavyweight</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-200 border-2 border-white shadow-sm overflow-hidden group-hover:border-mma-blue transition-all">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${athleteName}`} alt="Profile" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard View */}
                <div className="p-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="mb-10 flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Combat Overview</h2>
                                        <p className="text-slate-500 text-sm font-medium">Performance summary from Kathmandu Performance Lab</p>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-200">
                                        Last Updated: {new Date().toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid md:grid-cols-3 gap-8 mb-10">
                                    {stats.map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="premium-card p-8 rounded-[32px]"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                    {stat.icon}
                                                </div>
                                                <span className="text-xs font-black text-mma-blue bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{stat.change}</span>
                                            </div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                            <div className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 premium-card p-8 rounded-[40px] min-h-[400px]">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="font-black uppercase tracking-widest text-sm text-slate-400">Activity Trend</h3>
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-mma-blue" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Sessions</span>
                                            </div>
                                        </div>
                                        <div className="h-[300px] flex items-center justify-center text-slate-200 font-black uppercase text-xl border-dashed border-2 rounded-3xl">
                                            Training Volume Visualization
                                        </div>
                                    </div>
                                    <div className="premium-card p-8 rounded-[40px] flex flex-col">
                                        <h3 className="font-black uppercase tracking-widest text-sm text-slate-400 mb-6">Recent Striking</h3>
                                        <div className="flex-1 flex items-center justify-center text-slate-200 font-black uppercase text-xl border-dashed border-2 rounded-3xl">
                                            Strike Heatmap
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'history' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Training History</h2>
                                    <p className="text-slate-500 text-sm font-medium">Review and analyze your past sessions</p>
                                </div>

                                <div className="premium-card rounded-[40px] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Session ID</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {sessions.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No sessions found. Upload your first training video!</td>
                                                    </tr>
                                                ) : (
                                                    sessions.map((session) => (
                                                        <tr key={session._id} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="px-8 py-6">
                                                                <div className="font-bold text-slate-900 text-sm">{new Date(session.createdAt).toLocaleDateString()}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(session.createdAt).toLocaleTimeString()}</div>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <div className="text-xs font-mono text-slate-500">#{session._id.slice(-8).toUpperCase()}</div>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${session.status === 'completed' ? 'bg-emerald-50 text-emerald-500' :
                                                                    session.status === 'failed' ? 'bg-red-50 text-red-500' :
                                                                        'bg-blue-50 text-mma-blue animate-pulse'
                                                                    }`}>
                                                                    {session.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-6 text-right">
                                                                <button className="text-mma-blue font-black text-[10px] uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Analysis</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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

export default Dashboard;
