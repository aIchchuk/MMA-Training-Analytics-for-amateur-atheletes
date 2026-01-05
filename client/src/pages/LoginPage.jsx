import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = ({ onNavigate }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onNavigate('dashboard');
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Could not connect to server. Ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/30 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sky-100/40 blur-[100px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <button
                    onClick={() => onNavigate('landing')}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-mma-blue transition-colors text-sm font-bold uppercase tracking-widest group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="premium-card p-10 md:p-12 rounded-[32px] overflow-hidden relative">
                    {/* Subtle Internal Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="mb-10 text-center relative z-10">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Welcome Back</h1>
                        <p className="text-slate-500 text-sm font-medium">Log in to your athlete portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-mma-blue focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                <button type="button" className="text-[10px] font-bold text-mma-blue hover:text-blue-700 transition-colors uppercase tracking-widest">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-mma-blue focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-mma-blue transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <div className="w-5 h-5 rounded-md border-2 border-slate-200 bg-white flex items-center justify-center cursor-pointer hover:border-mma-blue transition-colors group">
                                <div className="w-2.5 h-2.5 rounded-sm bg-mma-blue opacity-0 group-hover:opacity-20 transition-opacity" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Keep me logged in</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group py-5 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-mma-blue hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:shadow-blue-500/30 uppercase tracking-[0.2em]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <LogIn size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center pt-8 border-t border-slate-100 relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            No account? {' '}
                            <button
                                onClick={() => onNavigate('register')}
                                className="text-mma-blue border-b-2 border-blue-50 hover:border-mma-blue transition-all pb-0.5 ml-2"
                            >
                                Register Now
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
