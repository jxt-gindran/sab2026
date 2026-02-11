import React, { useState, useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, UserPlus, Heart } from 'lucide-react';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-scale-in border border-slate-100 flex flex-col max-h-[90vh]">

                {/* Header Visual */}
                <div className="h-48 bg-brand-navy relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-brand-cyan/20 blur-3xl rounded-full" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <div className="bg-brand-cyan p-4 rounded-2xl mb-4 shadow-xl">
                            <UserPlus className="h-8 w-8 text-brand-navy" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">Join the Movement.</h2>
                        <p className="text-brand-cyan/80 font-black text-xs uppercase tracking-[0.3em]">Become an SAB 2026 Champion</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white text-white hover:text-brand-navy rounded-xl transition-all"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-10 overflow-y-auto">
                    <div className="space-y-8 mb-10">
                        <div className="flex gap-6">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-brand-navy flex-shrink-0 font-black">1</div>
                            <div>
                                <h4 className="font-black text-brand-navy text-lg mb-1">Official Registration</h4>
                                <p className="text-slate-500 font-medium">Fill out the official MMA SAB 2026 participation form via Google Forms.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-brand-navy flex-shrink-0 font-black">2</div>
                            <div>
                                <h4 className="font-black text-brand-navy text-lg mb-1">Health & Safety</h4>
                                <p className="text-slate-500 font-medium">Provide your medical clearance and endurance experience for the 660km ride.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-brand-navy flex-shrink-0 font-black">3</div>
                            <div>
                                <h4 className="font-black text-brand-navy text-lg mb-1">Fundraising Page</h4>
                                <p className="text-slate-500 font-medium">Once verified, we will create your custom "Champion" profile on this site.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4 mb-10">
                        <Heart className="h-5 w-5 text-brand-coral flex-shrink-0 mt-1" />
                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                            Note: Participation is subject to medical review and slot availability. All riders commit to a minimum fundraising target of RM 3,000.
                        </p>
                    </div>

                    <div className="w-full h-[600px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                        <iframe
                            src="https://docs.google.com/forms/d/e/1FAIpQLSdegK8dnkEAvIzY8n2p1KHDy8VryiGw7mRewrA4z9jHtYNkGQ/viewform?embedded=true"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            marginHeight={0}
                            marginWidth={0}
                            title="Registration Form"
                        >
                            Loading…
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;
