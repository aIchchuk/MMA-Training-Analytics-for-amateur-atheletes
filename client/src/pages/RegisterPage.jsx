import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            console.log("Registration attempt...", formData);
            setIsLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/30 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-100/40 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-xl relative z-10"
            >
                <button
                    onClick={() => onNavigate('landing')}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-mma-blue transition-colors text-sm font-bold uppercase tracking-widest group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="premium-card p-10 md:p-14 rounded-[40px] relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-50/50 blur-3xl rounded-full translate-y-1/2 translate-x-1/2" />

                    <div className="mb-12 text-center relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">Create Account</h1>
                        <p className="text-slate-500 text-sm font-medium">Join the elite combat analytics network</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors">
                                        <User size={18} />
                                    </span>
                                    <input
                                        type="text" required placeholder="John Doe"
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-mma-blue focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors">
                                        <Mail size={18} />
                                    </span>
                                    <input
                                        type="email" required placeholder="your@email.com"
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-mma-blue focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required placeholder="••••••••"
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

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required placeholder="••••••••"
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-mma-blue focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-mma-blue transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>



                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group py-5 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-mma-blue hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:shadow-blue-500/30 uppercase tracking-[0.2em]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Register Account <UserPlus size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-2 text-center pt-8 border-t border-slate-100 relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Already have an account? {' '}
                            <button
                                onClick={() => onNavigate('login')}
                                className="text-mma-blue border-b-2 border-blue-50 hover:border-mma-blue transition-all pb-0.5 ml-2"
                            >
                                Log In
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
