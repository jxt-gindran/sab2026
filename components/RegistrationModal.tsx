import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, UserPlus, AlertTriangle, ExternalLink, Heart } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useTranslation } from '../lib/i18n';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const settings = useQuery(api.admin.getPublicSettings) || [];
    const isFull = settings.find(s => s.key === 'registration_status')?.value === 'full';
    const formUrl = settings.find(s => s.key === 'registration_form_url')?.value || '';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-scale-in border border-slate-100">

                {/* Header Visual */}
                <div className={`h-48 relative overflow-hidden flex-shrink-0 ${isFull ? 'bg-slate-800' : 'bg-brand-navy'}`}>
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-brand-cyan/20 blur-3xl rounded-full" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <div className={`p-4 rounded-2xl mb-4 shadow-xl ${isFull ? 'bg-red-500' : 'bg-brand-cyan'}`}>
                            {isFull
                                ? <AlertTriangle className="h-8 w-8 text-white" />
                                : <UserPlus className="h-8 w-8 text-brand-navy" />
                            }
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">
                            {isFull ? t('modal.title_full') : t('modal.title_open')}
                        </h2>
                        <p className="text-brand-cyan/80 font-black text-xs uppercase tracking-[0.3em]">
                            {isFull ? t('modal.subtitle_full') : t('modal.subtitle_open')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white text-white hover:text-brand-navy rounded-xl transition-all"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-10">
                    {isFull ? (
                        /* FULL STATE */
                        <div className="text-center">
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 mb-8">
                                <p className="text-slate-600 font-medium text-lg leading-relaxed mb-2">
                                    {t('modal.full_interest')}
                                </p>
                                <p className="text-slate-500 font-medium">
                                    {t('modal.full_desc')}
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => { onClose(); navigate('/donate'); }}
                                    className="block w-full text-center bg-brand-orange text-white font-black py-4 rounded-2xl hover:bg-brand-cyan hover:text-brand-navy transition-all uppercase tracking-widest text-sm shadow-lg"
                                >
                                    {t('modal.full_support_btn')}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="block w-full text-center border-2 border-slate-200 text-slate-400 font-black py-4 rounded-2xl hover:border-brand-navy hover:text-brand-navy transition-all uppercase tracking-widest text-sm"
                                >
                                    {t('modal.full_close_btn')}
                                </button>
                            </div>
                        </div>
                    ) : formUrl ? (
                        /* OPEN WITH FORM LINK */
                        <div className="text-center">
                            <div className="space-y-6 mb-8 text-left">
                                {[
                                    { n: '1', title: t('modal.step1_title'), desc: t('modal.step1_desc') },
                                    { n: '2', title: t('modal.step2_title'), desc: t('modal.step2_desc') },
                                    { n: '3', title: t('modal.step3_title'), desc: t('modal.step3_desc') },
                                ].map(s => (
                                    <div key={s.n} className="flex gap-4">
                                        <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-brand-navy flex-shrink-0 font-black text-sm border border-slate-200">{s.n}</div>
                                        <div>
                                            <h4 className="font-black text-brand-navy mb-0.5">{s.title}</h4>
                                            <p className="text-slate-500 font-medium text-sm">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 mb-8">
                                <Heart className="h-4 w-4 text-brand-orange flex-shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                                    {t('modal.commitment')}
                                </p>
                            </div>
                            <a
                                href={formUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-brand-cyan text-brand-navy font-black py-5 rounded-2xl hover:bg-brand-orange hover:text-white transition-all uppercase tracking-widest text-sm shadow-lg"
                            >
                                <ExternalLink className="h-4 w-4" />
                                {t('modal.open_form')}
                            </a>
                        </div>
                    ) : (
                        /* OPEN BUT NO FORM URL SET YET */
                        <div className="text-center">
                            <p className="text-slate-500 font-medium mb-6">{t('modal.coming_soon')}</p>
                            <button
                                onClick={onClose}
                                className="border-2 border-brand-navy text-brand-navy font-black px-8 py-4 rounded-2xl hover:bg-brand-navy hover:text-white transition-all uppercase tracking-widest text-sm"
                            >
                                {t('modal.close')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;
