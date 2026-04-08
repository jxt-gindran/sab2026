import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Building, ArrowRight } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

const Contact: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white min-h-screen pt-32 pb-24 font-sans text-brand-slate">
            <div className="max-w-7xl mx-auto px-6 animate-fade-in">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm">{t('contact.tag')}</div>
                    <h1 className="text-5xl md:text-6xl font-black text-brand-navy mb-6 font-heading leading-tight">
                        {t('contact.heading1')} <br />
                        <span className="text-brand-cyan">{t('contact.heading2')}</span>
                    </h1>
                    <p className="text-xl text-brand-slate max-w-2xl mx-auto font-medium">
                        {t('contact.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    <div className="space-y-8">
                        {/* 1. Contact Details Card */}
                        <div className="bg-brand-pale/20 rounded-[3rem] p-10 border border-brand-pale h-auto">
                            <h3 className="text-3xl font-black text-brand-navy mb-8 font-heading">{t('contact.get_in_touch')}</h3>

                            <div className="space-y-8">
                                {/* Address */}
                                <div className="flex items-start gap-6">
                                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-brand-cyan shadow-sm shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brand-navy text-lg mb-1">{t('contact.hq_label')}</h4>
                                        <a
                                            href="https://maps.google.com/?q=MMA+House,+124,+Jalan+Pahang,+53000+Kuala+Lumpur"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-brand-slate hover:text-brand-orange transition-colors"
                                        >
                                            Malaysian Medical Association Foundation (MMAF)<br />
                                            4th Floor, MMA House, 124, Jalan Pahang,<br />
                                            53000 Kuala Lumpur, Malaysia.
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-6">
                                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-brand-cyan shadow-sm shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brand-navy text-lg mb-1">{t('contact.call_label')}</h4>
                                        <a
                                            href="tel:+60340411375"
                                            className="text-brand-slate hover:text-brand-orange transition-colors block text-xl font-medium"
                                        >
                                            +603-4041 1375
                                        </a>
                                        <span className="text-xs text-brand-slate/60 font-bold uppercase tracking-wider">{t('contact.call_hours')}</span>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-6">
                                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-brand-cyan shadow-sm shrink-0">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brand-navy text-lg mb-1">{t('contact.email_label')}</h4>
                                        <a
                                            href="mailto:sab2026@mma.org.my"
                                            className="text-brand-slate hover:text-brand-orange transition-colors block text-xl font-medium break-all"
                                        >
                                            sab2026@mma.org.my
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Socials */}
                            <div className="mt-12 pt-12 border-t border-brand-navy/10">
                                <h4 className="font-bold text-brand-navy text-lg mb-6">{t('contact.social_label')}</h4>
                                <div className="flex gap-4">
                                    <a href="https://www.facebook.com/sepedaamalborneo" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-brand-navy text-white flex items-center justify-center hover:bg-brand-orange transition-all hover:-translate-y-1">
                                        <Facebook className="h-6 w-6" />
                                    </a>
                                    <a href="https://www.instagram.com/sepedaamalborneo/" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-brand-navy text-white flex items-center justify-center hover:bg-brand-orange transition-all hover:-translate-y-1">
                                        <Instagram className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* 2. Sponsorship Inquiries Card (New) */}
                        <div className="bg-brand-orange text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-white/10 rounded-full blur-[50px]"></div>

                            <div className="relative z-10">
                                <Building className="h-12 w-12 mb-6 text-brand-navy" />
                                <h3 className="text-3xl font-black mb-4 font-heading">{t('contact.corporate_heading')}</h3>
                                <p className="text-white/90 font-medium mb-8 leading-relaxed">
                                    {t('contact.corporate_desc')}
                                </p>

                                <div className="space-y-4">
                                    <a
                                        href="mailto:sab2026@mma.org.my?subject=SAB2026%20Sponsorship%20Inquiry"
                                        className="w-full bg-brand-navy text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:text-brand-navy transition-all shadow-lg uppercase tracking-widest text-sm"
                                    >
                                        {t('contact.corporate_cta')} <ArrowRight className="h-4 w-4" />
                                    </a>
                                    <div className="text-center text-[10px] uppercase tracking-widest opacity-80 font-bold">
                                        sab2026@mma.org.my
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Embed */}
                    <div className="h-[800px] lg:h-full min-h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border border-brand-grey/20 relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.746769929567!2d101.69766931475735!3d3.169639997693583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4818fa89b09d%3A0xc32832857413699d!2sMalaysian%20Medical%20Association!5e0!3m2!1sen!2smy!4v1677649031206!5m2!1sen!2smy"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
