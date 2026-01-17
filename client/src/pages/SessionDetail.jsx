import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Play,
    Shield,
    Zap,
    Activity,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    Target,
    Clock,
    TrendingUp
} from 'lucide-react';

const SessionDetail = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAnnotated, setShowAnnotated] = useState(true);

    const fetchSessionDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            if (response.ok) {
                setSession(data);
                // If annotated video just became available, default to it
                if (!session?.annotatedVideoUrl && data.annotatedVideoUrl) {
                    setShowAnnotated(true);
                }
            }
        } catch (error) {
            console.error("Fetch session detail error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionDetails();
        // Poll for updates if session is still analyzing
        const interval = setInterval(() => {
            if (session?.status === 'analyzing' || session?.status === 'pending') {
                fetchSessionDetails();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [sessionId, session?.status]);

    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-mma-blue border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!session) return (
        <div className="text-center p-20">
            <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">Session not found</h2>
            <button onClick={() => navigate(-1)} className="mt-4 text-mma-blue font-bold uppercase text-xs tracking-widest">Return to Dashboard</button>
        </div>
    );

    const metrics = [
        { label: 'Guard Stability', value: `${session.metrics?.guardStability || 0}%`, icon: <Shield size={20} className="text-blue-500" />, sub: 'Hands in position' },
        { label: 'Takedown Shot', value: `${session.metrics?.takedownSpeed || 0}cm`, icon: <Zap size={20} className="text-orange-500" />, sub: 'Vertical depth' },
        { label: 'Peak Extension', value: `${session.metrics?.strikeVolume || 0}°`, icon: <Target size={20} className="text-emerald-500" />, sub: 'Jab extension' },
        { label: 'AI Accuracy', value: `${session.metrics?.accuracyScore || 0}%`, icon: <CheckCircle2 size={20} className="text-slate-400" />, sub: 'Model confidence' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 pb-20"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session ID</div>
                        <div className="text-xs font-mono font-bold text-slate-900">#{session._id.slice(-8).toUpperCase()}</div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Video Player Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="premium-card rounded-[40px] overflow-hidden relative group bg-black aspect-video">
                        <video
                            key={showAnnotated ? 'annotated' : 'raw'}
                            src={showAnnotated && session.annotatedVideoUrl ? session.annotatedVideoUrl : session.videoUrl}
                            controls
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-6 left-6 flex gap-3 pointer-events-none">
                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-xl ${session.status === 'completed' ? 'bg-emerald-500/80 text-white' :
                                session.status === 'failed' ? 'bg-red-500/80 text-white' :
                                    'bg-mma-blue/80 text-white animate-pulse'
                                }`}>
                                {session.status}
                            </span>
                            {session.annotatedVideoUrl && (
                                <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 text-white backdrop-blur-md border border-white/30">
                                    AI-Vision Active
                                </span>
                            )}
                        </div>

                        {session.annotatedVideoUrl && (
                            <div className="absolute top-6 right-6 z-10">
                                <button
                                    onClick={() => setShowAnnotated(!showAnnotated)}
                                    className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl ${showAnnotated
                                        ? 'bg-mma-blue text-white ring-4 ring-mma-blue/20'
                                        : 'bg-white/80 text-slate-900 hover:bg-white'
                                        }`}
                                >
                                    {showAnnotated ? 'Show Raw Footage' : 'View AI Skeleton'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Feedback Timeline */}
                    <div className="premium-card p-10 rounded-[40px]">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <AlertTriangle size={18} className="text-orange-500" /> AI Biometric Feedback
                        </h3>
                        <div className="space-y-6">
                            {!session.feedback || session.feedback.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Analysis in progress or no critical issues found.</p>
                                </div>
                            ) : (
                                session.feedback.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-6 p-6 rounded-[28px] bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all group"
                                    >
                                        <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm font-black text-xs text-mma-blue">
                                            {item.timestamp}s
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{item.issue}</h4>
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.severity === 'high' ? 'bg-red-100 text-red-500' :
                                                    item.severity === 'medium' ? 'bg-orange-100 text-orange-500' :
                                                        'bg-blue-100 text-mma-blue'
                                                    }`}>
                                                    {item.severity}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.suggestion}</p>
                                        </div>
                                        <div className="flex items-center pr-2">
                                            <Play size={16} className="text-slate-300 group-hover:text-mma-blue transition-colors cursor-pointer" />
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Performance Summary: Strengths, Flaws, Improvement */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        <div className="premium-card p-8 rounded-[36px] border-emerald-100 bg-emerald-50/20">
                            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle2 size={16} /> Strengths
                            </h4>
                            <ul className="space-y-3">
                                {session.status !== 'completed' ? (
                                    <li className="text-xs font-bold text-slate-400 animate-pulse italic">Awaiting AI Analysis...</li>
                                ) : (session.analysisSummary?.strengths?.length > 0 ? session.analysisSummary.strengths : ['Optimal Guard Position', 'Consistent Pace']).map((s, i) => (
                                    <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="premium-card p-8 rounded-[36px] border-red-100 bg-red-50/20">
                            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle size={16} /> Flaws
                            </h4>
                            <ul className="space-y-3">
                                {session.status !== 'completed' ? (
                                    <li className="text-xs font-bold text-slate-400 animate-pulse italic">Awaiting AI Analysis...</li>
                                ) : (session.analysisSummary?.flaws?.length > 0 ? session.analysisSummary.flaws : ['Minor Chin Exposure', 'Low Lead Hand']).map((s, i) => (
                                    <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="premium-card p-8 rounded-[36px] border-blue-100 bg-blue-50/20">
                            <h4 className="text-[10px] font-black text-mma-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TrendingUp size={16} /> Improvement
                            </h4>
                            <ul className="space-y-3">
                                {session.status !== 'completed' ? (
                                    <li className="text-xs font-bold text-slate-400 animate-pulse italic">Awaiting AI Analysis...</li>
                                ) : (session.analysisSummary?.improvements?.length > 0 ? session.analysisSummary.improvements : ['Tighten Guard Placement', 'Increase Shot Depth']).map((s, i) => (
                                    <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-mma-blue mt-1.5" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Metrics Sidebar */}
                <div className="space-y-8">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card p-8 rounded-[36px] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                {metric.icon}
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                    {metric.icon}
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</div>
                                    <div className="text-[9px] font-bold text-mma-blue uppercase tracking-widest">{metric.sub}</div>
                                </div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">
                                {session.status === 'completed' ? metric.value : '--'}
                            </div>
                        </motion.div>
                    ))}

                    <div className="premium-card p-10 rounded-[40px] bg-white border-2 border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <Activity size={18} className="text-mma-blue" />
                                Conclusion & Master Feedback
                            </h3>
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('token');
                                        const response = await fetch(`http://localhost:5000/api/sessions/${session._id}/notes`, {
                                            method: 'PATCH',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'x-auth-token': token
                                            },
                                            body: JSON.stringify({ coachNotes: session.coachNotes })
                                        });
                                        if (response.ok) alert("Feedback saved!");
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                                className="text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-mma-blue transition-all"
                            >
                                Save Feedback
                            </button>
                        </div>
                        <textarea
                            value={session.coachNotes || ''}
                            onChange={(e) => setSession({ ...session, coachNotes: e.target.value })}
                            placeholder="Add coach observations, athlete feeling, or specific technical focus points here..."
                            className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-[30px] p-8 text-sm font-medium focus:border-mma-blue outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="premium-card p-10 rounded-[40px] bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="text-mma-blue" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Research Insight</h3>
                        </div>
                        {session.description && (
                            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Context</div>
                                <p className="text-xs text-slate-300 italic">"{session.description}"</p>
                            </div>
                        )}
                        <p className="text-slate-400 text-xs leading-relaxed font-medium mb-6 italic">
                            "Data indicates a strong <strong>Level Change</strong> efficiency. Center of gravity drop was optimized within {session.metrics?.takedownSpeed || 0}cm range."
                        </p>
                        <div className="text-[10px] font-black text-mma-blue uppercase tracking-[0.3em]">Kathmandu AI Lab</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SessionDetail;
