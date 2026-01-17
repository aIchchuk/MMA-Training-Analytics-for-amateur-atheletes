import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Overview = () => {
    const [sessions, setSessions] = useState([]);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/sessions', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            }
        } catch (error) {
            console.error("Fetch sessions error:", error);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const stats = {
        total: sessions.length,
        completed: sessions.filter(s => s.status === 'completed').length,
        pending: sessions.filter(s => s.status === 'pending' || s.status === 'analyzing').length
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Sessions', value: stats.total, icon: <LayoutDashboard className="text-mma-blue" />, sub: 'All saved data' },
                    { label: 'AI Completed', value: stats.completed, icon: <Activity className="text-emerald-500" />, sub: 'Analyzed & Scored' },
                    { label: 'In Queue', value: stats.pending, icon: <Activity className="text-orange-500" />, sub: 'Processing...' }
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-10 rounded-[40px] hover-scale">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="premium-card p-10 rounded-[40px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                            <Activity size={18} className="text-mma-blue" />
                            Performance Trend
                        </h3>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black uppercase text-slate-400 tracking-widest">Last 30 Days</div>
                    </div>
                    <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[30px] text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50/50">
                        AI Analytics Chart Placeholder
                    </div>
                </div>
                <div className="premium-card p-10 rounded-[40px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                            <Activity size={18} className="text-mma-blue" />
                            Strike Accuracy
                        </h3>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black uppercase text-slate-400 tracking-widest">AI Detection</div>
                    </div>
                    <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[30px] text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50/50">
                        Accuracy Visualization Placeholder
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Overview;
