import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SessionHistory = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

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

    useEffect(() => {
        const hasPending = sessions.some(s => s.status === 'pending' || s.status === 'analyzing');
        if (!hasPending) return;

        const interval = setInterval(() => {
            fetchSessions();
        }, 5000);

        return () => clearInterval(interval);
    }, [sessions]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-10 rounded-[40px]"
        >
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Activity size={18} className="text-mma-blue" />
                Biometric Session History
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Time</th>
                            <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Session ID</th>
                            <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sessions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No training sessions found.</td>
                            </tr>
                        ) : (
                            sessions.map((session) => (
                                <tr key={session._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-8">
                                        <div className="text-xs font-bold text-slate-900">{new Date(session.createdAt).toLocaleDateString()}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">{new Date(session.createdAt).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="py-8">
                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-mono font-bold text-slate-600">
                                            #{session._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${session.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                            session.status === 'pending' || session.status === 'analyzing' ? 'bg-mma-blue/10 text-mma-blue animate-pulse' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="py-8 text-right">
                                        <button
                                            onClick={() => navigate(`/sessions/${session._id}`)}
                                            className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-mma-blue transition-all"
                                        >
                                            View Analysis
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default SessionHistory;
