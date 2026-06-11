import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Bike, Heart, Mail, AlertCircle } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-brand-pale rounded-2xl overflow-hidden mb-4 bg-white hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-bold text-brand-navy text-lg pr-4">{question}</span>
                {isOpen ? <ChevronUp className="h-5 w-5 text-brand-orange flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-brand-cyan flex-shrink-0" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-0 text-brand-slate leading-relaxed animate-fade-in">
                    {answer}
                </div>
            )}
        </div>
    );
};

/** Extended FAQ item that renders a rich React node as the answer */
const FAQItemRich = ({ question, children }: { question: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-brand-pale rounded-2xl overflow-hidden mb-4 bg-white hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-bold text-brand-navy text-lg pr-4">{question}</span>
                {isOpen ? <ChevronUp className="h-5 w-5 text-brand-orange flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-brand-cyan flex-shrink-0" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-2 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

const FAQ: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 animate-fade-in">

                <div className="text-center mb-16">
                    <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm">{t('faq.tag')}</div>
                    <h1 className="text-4xl md:text-5xl font-black text-brand-navy mb-6 font-heading">
                        {t('faq.heading1')} <br />
                        <span className="text-brand-cyan">{t('faq.heading2')}</span>
                    </h1>
                </div>

                {/* Section 1: Donors */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-brand-orange p-3 rounded-2xl text-white shadow-lg shadow-brand-orange/30">
                            <Heart className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-black text-brand-navy font-heading">{t('faq.donors_heading')}</h2>
                    </div>
                    <div className="space-y-2">
                        <FAQItem question={t('faq.q1')} answer={t('faq.a1')} />
                        <FAQItem question={t('faq.q2')} answer={t('faq.a2')} />
                        <FAQItem question={t('faq.q3')} answer={t('faq.a3')} />
                        <FAQItem question={t('faq.q4')} answer={t('faq.a4')} />

                        {/* Tax Receipt — rich answer */}
                        <FAQItemRich question={t('taxReceipt.faq_q')}>
                            <p className="text-brand-slate leading-relaxed mb-4">
                                {t('taxReceipt.intro')}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {[t('taxReceipt.email1'), t('taxReceipt.email2')].map(email => (
                                    <a
                                        key={email}
                                        href={`mailto:${email}`}
                                        className="inline-flex items-center gap-2 text-sm font-black text-brand-navy bg-brand-pale/50 hover:bg-brand-cyan/20 border border-brand-pale hover:border-brand-cyan rounded-xl px-4 py-2 transition-all"
                                    >
                                        <Mail className="h-4 w-4 text-brand-cyan" />
                                        {email}
                                    </a>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className="bg-brand-pale/30 rounded-2xl p-4 border border-brand-pale">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy mb-2">
                                        {t('taxReceipt.individual_heading')}
                                    </div>
                                    <p className="text-sm text-brand-slate font-medium leading-relaxed">
                                        {t('taxReceipt.individual_fields')}
                                    </p>
                                </div>
                                <div className="bg-brand-pale/30 rounded-2xl p-4 border border-brand-pale">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy mb-2">
                                        {t('taxReceipt.corporate_heading')}
                                    </div>
                                    <p className="text-sm text-brand-slate font-medium leading-relaxed">
                                        {t('taxReceipt.corporate_fields')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 font-bold">{t('taxReceipt.note')}</p>
                            </div>
                        </FAQItemRich>

                        <FAQItem question={t('faq.q5')} answer={t('faq.a5')} />
                    </div>
                </div>

                {/* Section 2: Cyclists */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-brand-cyan p-3 rounded-2xl text-brand-navy shadow-lg shadow-brand-cyan/30">
                            <Bike className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-black text-brand-navy font-heading">{t('faq.cyclists_heading')}</h2>
                    </div>
                    <div className="space-y-2">
                        <FAQItem question={t('faq.q6')} answer={t('faq.a6')} />
                        <FAQItem question={t('faq.q7')} answer={t('faq.a7')} />
                        <FAQItem question={t('faq.q8')} answer={t('faq.a8')} />
                        <FAQItem question={t('faq.q9')} answer={t('faq.a9')} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FAQ;
