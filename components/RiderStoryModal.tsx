import React from 'react';
import { X, Heart, Shield, Award, Facebook, Instagram, Linkedin, Quote } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface Rider {
    id: number;
    name: string;
    role: string;
    image: string;
    story: string;
    goal: number;
    raised: number;
    social?: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
    };
}

interface RiderStoryModalProps {
    rider: Rider | null;
    onClose: () => void;
}

const RiderStoryModal: React.FC<RiderStoryModalProps> = ({ rider, onClose }) => {
    const { t } = useTranslation();
    if (!rider) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-scale-in border border-slate-100 flex flex-col md:flex-row max-h-[90vh]">

                {/* Left: Image Side */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                    <img
                        src={rider.image}
                        alt={rider.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8">
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-1">{rider.name}</h2>
                        <div className="text-brand-cyan font-black text-xs uppercase tracking-[0.3em]">{rider.role}</div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white text-white hover:text-brand-navy rounded-xl transition-all md:hidden z-20"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Right: Story Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto relative bg-white">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 bg-slate-50 hover:bg-brand-navy text-slate-400 hover:text-white rounded-xl transition-all hidden md:block"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="mb-10">
                        <Quote className="h-10 w-10 text-brand-cyan/20 mb-6" />
                        <h3 className="text-2xl font-black text-brand-navy mb-6 leading-tight">{t('riderstory.cycling_quote')}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-6">
                            {rider.story}
                        </p>
                    </div>

                    {/* Progress Bar in Modal */}
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('riderstory.progress_label')}</div>
                                <div className="text-2xl font-black text-brand-navy">RM {rider.raised.toLocaleString()}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('riderstory.goal_label')}</div>
                                <div className="text-sm font-bold text-brand-navy">RM {rider.goal.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-brand-coral transition-all duration-1000"
                                style={{ width: `${(rider.raised / rider.goal) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-6">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('riderstory.connect_label')}</span>
                        <div className="flex gap-4">
                            {rider.social?.facebook && (
                                <a href={rider.social.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-brand-navy hover:bg-brand-cyan transition-all">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {rider.social?.instagram && (
                                <a href={rider.social.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-brand-navy hover:bg-brand-cyan transition-all">
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {rider.social?.linkedin && (
                                <a href={rider.social.linkedin} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-brand-navy hover:bg-brand-cyan transition-all">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderStoryModal;
