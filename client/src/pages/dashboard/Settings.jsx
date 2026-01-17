import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Lock,
    User,
    Shield,
    Smartphone,
    LogOut,
    ExternalLink,
    ChevronRight,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
    const [notifications, setNotifications] = useState({
        aiAnalysis: true,
        performancePeaks: true,
        communityUpdates: false
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sections = [
        {
            title: 'Account Security',
            icon: <Lock size={20} className="text-mma-blue" />,
            items: [
                { label: 'Two-Factor Authentication', status: 'Disabled', type: 'toggle' },
                { label: 'Update Password', type: 'link' },
                { label: 'Login History', type: 'link' }
            ]
        },
        {
            title: 'Lab Notifications',
            icon: <Bell size={20} className="text-orange-500" />,
            items: [
                { label: 'AI Analysis Completed', state: 'aiAnalysis', type: 'switch' },
                { label: 'Performance Peaks', state: 'performancePeaks', type: 'switch' },
                { label: 'Biometric Goal Alerts', state: 'communityUpdates', type: 'switch' }
            ]
        },
        {
            title: 'Data & Privacy',
            icon: <Shield size={20} className="text-emerald-500" />,
            items: [
                { label: 'Encrypted Video Vault', status: 'Active', type: 'status' },
                { label: 'Export Training Data (CSV/JSON)', type: 'link' },
                { label: 'Delete Account', type: 'link', color: 'text-red-500' }
            ]
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-10 pb-20"
        >
            <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">System Settings</h2>
                <p className="text-slate-500 text-sm font-medium">Manage your lab preferences and secure your biometric data</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {sections.map((section, idx) => (
                    <div key={idx} className="premium-card p-10 rounded-[40px]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                                {section.icon}
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{section.title}</h3>
                        </div>

                        <div className="space-y-6">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-[28px] bg-slate-50/50 border border-slate-100 group hover:border-slate-200 transition-all">
                                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.label}</div>

                                    {item.type === 'switch' && (
                                        <button
                                            onClick={() => toggleNotification(item.state)}
                                            className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.state] ? 'bg-mma-blue' : 'bg-slate-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.state] ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    )}

                                    {item.type === 'link' && (
                                        <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${item.color || 'text-slate-400'} hover:text-mma-blue transition-colors`}>
                                            Manage <ChevronRight size={14} />
                                        </button>
                                    )}

                                    {item.type === 'status' && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle2 size={14} /> {item.status}
                                        </div>
                                    )}

                                    {item.type === 'toggle' && (
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.status}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center p-10 border-2 border-dashed border-slate-200 rounded-[40px] opacity-60">
                    <div className="flex items-center gap-4 text-slate-400">
                        <Smartphone size={24} />
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest">Mobile Application</div>
                            <div className="text-xs font-medium">Sync biometric data with our iOS/Android app</div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-mma-blue">
                        Get App <ExternalLink size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
