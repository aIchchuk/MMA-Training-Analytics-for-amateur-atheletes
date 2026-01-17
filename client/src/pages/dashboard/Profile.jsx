import React, { useState, useEffect } from 'react';
import { User, Camera, Shield, Activity, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        weight: '',
        division: '',
        background: '',
        history: '',
        profileImage: '',
        level: '',
        gym: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                // Also update localStorage if needed
                const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...savedUser, name: data.name, level: data.level, profileImage: data.profileImage }));
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(profile)
            });
            if (response.ok) {
                setIsEditing(false);
                fetchProfile(); // Refresh
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Update profile error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/profile/image', {
                method: 'POST',
                headers: { 'x-auth-token': token },
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(prev => ({ ...prev, profileImage: data.profileImage }));
                alert("Profile image updated!");
            }
        } catch (error) {
            console.error("Image upload error:", error);
        } finally {
            setUploadingImage(false);
        }
    };

    if (isLoading) return <div className="h-96 flex items-center justify-center text-slate-400 font-black uppercase tracking-widest animate-pulse">Loading Athlete Data...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Athlete Profile</h2>
                    <p className="text-slate-500 text-sm font-medium">Manage your fighter identity and competitive stats</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-mma-blue transition-all"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Picture Card */}
                <div className="md:col-span-1">
                    <div className="premium-card p-8 rounded-[40px] text-center space-y-6">
                        <div className="relative inline-block group">
                            <div className="w-48 h-48 rounded-[40px] bg-slate-100 overflow-hidden border-4 border-white shadow-xl relative transition-transform group-hover:scale-105 duration-500">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User size={80} />
                                    </div>
                                )}
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-mma-blue text-white rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-900 transition-colors shadow-lg group-hover:scale-110 duration-300">
                                <Camera size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{profile.name}</h3>
                            <p className="text-mma-blue text-[10px] font-black uppercase tracking-[0.2em]">{profile.level} • {profile.division || 'Uncategorized'}</p>
                        </div>

                        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Weight</div>
                                <div className="text-sm font-black text-slate-900">{profile.weight || '--'} kg</div>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Rank</div>
                                <div className="text-sm font-black text-slate-900">#72</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Form Card */}
                <div className="md:col-span-2">
                    <div className="premium-card p-10 rounded-[40px] h-full">
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-mma-blue transition-all outline-none disabled:opacity-70"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        disabled={!isEditing}
                                        value={profile.weight}
                                        onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-mma-blue transition-all outline-none disabled:opacity-70"
                                        placeholder="e.g. 77"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Weight Division</label>
                                    <select
                                        disabled={!isEditing}
                                        value={profile.division}
                                        onChange={(e) => setProfile({ ...profile, division: e.target.value })}
                                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-mma-blue transition-all outline-none disabled:opacity-70 appearance-none"
                                    >
                                        <option value="">Select Division</option>
                                        <option value="Flyweight">Flyweight (125 lbs)</option>
                                        <option value="Bantamweight">Bantamweight (135 lbs)</option>
                                        <option value="Featherweight">Featherweight (145 lbs)</option>
                                        <option value="Lightweight">Lightweight (155 lbs)</option>
                                        <option value="Welterweight">Welterweight (170 lbs)</option>
                                        <option value="Middleweight">Middleweight (185 lbs)</option>
                                        <option value="Light Heavyweight">Light Heavyweight (205 lbs)</option>
                                        <option value="Heavyweight">Heavyweight (265 lbs)</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Background Background</label>
                                    <select
                                        disabled={!isEditing}
                                        value={profile.background}
                                        onChange={(e) => setProfile({ ...profile, background: e.target.value })}
                                        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-mma-blue transition-all outline-none disabled:opacity-70 appearance-none"
                                    >
                                        <option value="">Select Primary Style</option>
                                        <option value="Striker">Striker (Boxing/MT)</option>
                                        <option value="Wrestler">Wrestler (Freestyle/Greco)</option>
                                        <option value="Grappler">Grappler (BJJ/Judo)</option>
                                        <option value="All-rounder">All-rounder (Mixed)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Training History / Biography</label>
                                <textarea
                                    disabled={!isEditing}
                                    value={profile.history}
                                    onChange={(e) => setProfile({ ...profile, history: e.target.value })}
                                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-[32px] px-8 py-6 text-sm font-medium focus:border-mma-blue transition-all outline-none disabled:opacity-70 resize-none h-40"
                                    placeholder="Write a brief history of your martial arts journey..."
                                />
                            </div>

                            <AnimatePresence>
                                {isEditing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="flex gap-4 pt-4"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                fetchProfile(); // Reset
                                            }}
                                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-2 bg-mma-blue text-white px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:-translate-y-1 transition-all shadow-xl disabled:opacity-50"
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>
            </div>

            {/* Performance Stats Teaser */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Combat Readiness', value: '88%', icon: <Shield size={18} className="text-secondary-gold" />, sub: 'AI Prediction' },
                    { label: 'Avg Strike Power', value: '742N', icon: <TrendingUp size={18} className="text-red-500" />, sub: 'Biometric Max' },
                    { label: 'Mat Time', value: '142h', icon: <Target size={18} className="text-mma-blue" />, sub: 'Season Total' }
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-8 rounded-[40px] hover-scale">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.sub}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Profile;
