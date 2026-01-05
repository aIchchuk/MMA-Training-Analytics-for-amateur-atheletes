import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, ArrowLeft, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = ({ onNavigate }) => {
    const [step, setStep] = useState(1); // 1: Info, 2: OTP
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStep(2);
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Could not connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otp
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onNavigate('dashboard');
            } else {
                alert(data.message || "Invalid code");
            }
        } catch (error) {
            console.error("OTP error:", error);
            alert("Could not connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden text-slate-900">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/30 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-100/40 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl relative z-10"
            >
                <button
                    onClick={() => step === 1 ? onNavigate('landing') : setStep(1)}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-mma-blue transition-colors text-sm font-bold uppercase tracking-widest group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> {step === 1 ? 'Back' : 'Change Info'}
                </button>

                <div className="premium-card p-10 md:p-14 rounded-[40px] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="mb-12 text-center">
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">Join the Lab</h1>
                                    <p className="text-slate-500 text-sm font-medium">Create your elite athlete profile</p>
                                </div>

                                <form onSubmit={handleInfoSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <div className="relative group">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors"><User size={18} /></span>
                                                <input
                                                    type="text" required placeholder="John Doe"
                                                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-mma-blue focus:bg-white transition-all font-medium placeholder:text-slate-300"
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    value={formData.name}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <div className="relative group">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors"><Mail size={18} /></span>
                                                <input
                                                    type="email" required placeholder="your@email.com"
                                                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-mma-blue focus:bg-white transition-all font-medium placeholder:text-slate-300"
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    value={formData.email}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                            <div className="relative group">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors"><Lock size={18} /></span>
                                                <input
                                                    type={showPassword ? "text" : "password"} required placeholder="••••••••"
                                                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-mma-blue focus:bg-white transition-all font-medium placeholder:text-slate-300"
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    value={formData.password}
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                                            <div className="relative group">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-mma-blue transition-colors"><Lock size={18} /></span>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"} required placeholder="••••••••"
                                                    className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-mma-blue focus:bg-white transition-all font-medium placeholder:text-slate-300"
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    value={formData.confirmPassword}
                                                />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit" disabled={isLoading}
                                        className="w-full group py-5 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-mma-blue hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 uppercase tracking-[0.2em]"
                                    >
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continue to Verify <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center"
                            >
                                <div className="mb-10">
                                    <div className="w-20 h-20 bg-blue-50 text-mma-blue rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                                        <ShieldCheck size={40} strokeWidth={1.5} />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Verification</h1>
                                    <p className="text-slate-500 text-sm font-medium">We sent a 6-digit code to <br /><span className="text-slate-900 font-bold">{formData.email}</span></p>
                                </div>

                                <form onSubmit={handleOtpSubmit} className="space-y-8">
                                    <div className="relative group max-w-[240px] mx-auto">
                                        <input
                                            type="text" required maxLength="6" placeholder="000000"
                                            className="w-full bg-white/50 border-2 border-slate-200 rounded-2xl py-5 px-4 text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-mma-blue focus:bg-white transition-all placeholder:text-slate-200 text-slate-900"
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            value={otp}
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        type="submit" disabled={isLoading || otp.length !== 6}
                                        className="w-full group py-5 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-mma-blue hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 uppercase tracking-[0.2em]"
                                    >
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Complete Registration <UserPlus size={18} /></>}
                                    </button>

                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pt-4">
                                        Didn't get the code? <button type="button" onClick={handleInfoSubmit} className="text-mma-blue hover:underline">Resend Email</button>
                                    </p>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 text-center pt-8 border-t border-slate-100 relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Already part of the lab? {' '}
                            <button
                                onClick={() => onNavigate('login')}
                                className="text-mma-blue border-b-2 border-blue-50 hover:border-mma-blue transition-all pb-0.5 ml-2"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
