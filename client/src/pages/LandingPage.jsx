import React from 'react';
import { Shield, Zap, Target, ArrowRight, Activity, BarChart3, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = ({ onNavigate }) => {
    const features = [
        {
            icon: <Activity className="w-6 h-6 text-mma-blue" />,
            title: "Skeletal Tracking",
            desc: "Precise 33-point body analysis for striking mechanics. Optimized for amateur movement patterns."
        },
        {
            icon: <Zap className="w-6 h-6 text-mma-blue" />,
            title: "Instant Response",
            desc: "Real-time performance feedback after every upload. No expensive sensors required."
        },
        {
            icon: <Shield className="w-6 h-6 text-mma-blue" />,
            title: "Guard Stability",
            desc: "AI-driven detection of hand position during combinations to ensure head protection."
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Smooth Centered Hero */}
            <section className="relative pt-25 pb-32 px-6 overflow-hidden">
                {/* Enhanced Background Texture */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100/40 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-sky-50/60 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full premium-card text-mma-blue text-[10px] font-bold tracking-widest uppercase mb-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-mma-blue animate-ping" />
                            Kathmandu Performance Lab Active
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-10 text-slate-900 uppercase">
                            Optimize Your <br />
                            <span className="text-mma-blue">Combat DNA.</span>
                        </h1>

                        <p className="text-slate-500 text-lg md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
                            Professional-grade AI biomechanics for the modern amateur. <br className="hidden md:block" />
                            Analyze strikes, track progress, and win the technical battle.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => onNavigate('register')}
                                className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-mma-blue hover:-translate-y-1 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-500/30 flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                START ANALYSIS <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => onNavigate('login')}
                                className="w-full sm:w-auto px-12 py-5 premium-card text-slate-900 font-bold rounded-2xl hover:bg-white hover:-translate-y-1 transition-all uppercase tracking-widest text-xs"
                            >
                                Athlete Portal
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Grid with Enhanced Glass */}
            <section className="pb-40 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-10">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8, scale: 1.01 }}
                            className="p-12 premium-card rounded-[40px] flex flex-col items-start text-left group"
                        >
                            <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-mma-blue group-hover:text-white transition-all duration-500">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900 uppercase tracking-tight">{f.title}</h3>
                            <p className="text-slate-500 text-base leading-relaxed font-medium">
                                {f.desc}
                            </p>
                            <div className="mt-8 text-mma-blue group-hover:translate-x-2 transition-transform cursor-pointer">
                                <ChevronRight size={24} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Dynamic Glass Stats Panel */}
            <div className="max-w-7xl mx-auto px-6 mb-40">
                <div className="premium-card rounded-[50px] p-10 md:p-16 flex flex-wrap justify-around gap-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-50/20 mix-blend-overlay pointer-events-none" />
                    {[
                        { label: "Analyses", val: "2,400+" },
                        { label: "Gyms", val: "12" },
                        { label: "Accuracy", val: "94%" },
                        { label: "Real-time", val: "42ms" }
                    ].map((s, idx) => (
                        <div key={idx} className="relative z-10">
                            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">{s.val}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
