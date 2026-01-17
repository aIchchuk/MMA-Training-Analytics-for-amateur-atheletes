import React, { useState, useEffect } from 'react';
import {
    Activity,
    TrendingUp,
    Zap,
    Target,
    Calendar,
    ChevronDown,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

const Performance = () => {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/sessions', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setSessions(data.filter(s => s.status === 'completed'));
            }
        } catch (error) {
            console.error("Fetch sessions error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Prepare data for Trend Chart
    const trendData = sessions.slice().reverse().map(s => ({
        date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        power: s.metrics?.averageImpactForce || Math.floor(Math.random() * 200) + 400, // Fallback for demo
        speed: s.metrics?.strikeSpeed || Math.floor(Math.random() * 5) + 8
    }));

    // Prepare data for Discipline Pie Chart
    const disciplineCounts = sessions.reduce((acc, s) => {
        const type = s.sessionType || 'boxing';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const disciplineData = Object.keys(disciplineCounts).map(name => ({
        name: name.replace('_', ' ').toUpperCase(),
        value: disciplineCounts[name]
    }));

    const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

    if (isLoading) return <div className="h-96 flex items-center justify-center text-slate-400 font-black uppercase tracking-widest animate-pulse">Calculating Biometrics...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Biometric Analytics</h2>
                    <p className="text-slate-500 text-sm font-medium">Advanced performance tracking from Kathmandu Performance Lab</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                        {['7d', '30d', 'all'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-400 hover:text-mma-blue transition-colors shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Strike Power', value: '682N', icon: <Zap size={18} />, trend: '+12%', color: 'text-mma-blue' },
                    { label: 'Form Accuracy', value: '84%', icon: <Target size={18} />, trend: '+5%', color: 'text-emerald-500' },
                    { label: 'Reaction Time', value: '240ms', icon: <Activity size={18} />, trend: '-18ms', color: 'text-orange-500' },
                    { label: 'Intensity Score', value: '8.2', icon: <TrendingUp size={18} />, trend: 'Peak', color: 'text-purple-500' }
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-8 rounded-[35px] hover-scale group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{stat.trend}</div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Impact Trend Area Chart */}
                <div className="lg:col-span-2 premium-card p-10 rounded-[40px]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <TrendingUp size={18} className="text-mma-blue" />
                                Impact Force Progression
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Measured in Newtons (N) per Hit</p>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            AI Calibrated
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                        padding: '15px'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="power"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorPower)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Session Distribution Pie Chart */}
                <div className="premium-card p-10 rounded-[40px] flex flex-col">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                        <Activity size={18} className="text-mma-blue" />
                        Training Mix
                    </h3>

                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={disciplineData.length > 0 ? disciplineData : [{ name: 'EMPTY', value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {disciplineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                    ))}
                                    {disciplineData.length === 0 && <Cell fill="#f1f5f9" />}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4 pt-6 mt-auto border-t border-slate-100">
                        {disciplineData.map((d, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{d.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400">{d.value} SESS</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Secondary Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="premium-card p-10 rounded-[40px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Monthly Workload</h3>
                        <Calendar size={18} className="text-slate-400" />
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData.slice(-7)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" hide />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="power" fill="#2563eb" radius={[10, 10, 10, 10]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-12 text-white overflow-hidden relative group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="w-12 h-12 bg-mma-blue rounded-2xl flex items-center justify-center mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">AI Coach Insight</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Your impact force has increased by <span className="text-white font-bold">12%</span> in the last 7 days. Your left hook velocity is consistently peaking in the 2nd round. Suggesting focus on <span className="text-mma-blue font-bold">Hip Rotation Torque</span> drills next.
                            </p>
                        </div>
                        <button className="mt-8 bg-white/10 hover:bg-white/20 transition-all border border-white/10 py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                            Open Full Analysis Report
                        </button>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-mma-blue/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                </div>
            </div>
        </motion.div>
    );
};

export default Performance;
