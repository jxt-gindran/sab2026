import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Heart,
  User,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Grab,
  Lock,
  Flag
} from 'lucide-react';

import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useTranslation } from '../lib/i18n';
import DonationSliderStep from '../components/DonationSliderStep';

import ridersData from '../data/riders.json';

const Donate: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [step, setStep] = useState(1);
  // Single source of truth for donation amount (replaces selectedAmount + customAmount)
  const [donationAmount, setDonationAmount] = useState(500);
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'HITPAY' | 'TRANSFER' | null>(null);
  const [copied, setCopied] = useState(false);

  // Convex Hooks
  const createPaymentLink = useAction(api.payments.createLink);
  const addDonation = useMutation(api.donations.add);
  const allCyclists = useQuery(api.cyclists.listAll) || [];
  const cyclists = allCyclists.filter((c: any) => !c.isArchived);

  // Form State
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorIC, setDonorIC] = useState('');

  // Check if a rider was passed in the URL (e.g. from Home page or Share link)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('cyclist');
    if (slug && cyclists.length > 0) {
      const match = cyclists.find((c: any) => c.shareSlug === slug);
      if (match) setSelectedRider(match._id);
    }
  }, [location, cyclists]);

  const nextStep = () => {
    // Step 3 is now personal info (was step 2)
    if (step === 3) {
      if (!donorName.trim() || !donorEmail.trim() || !donorPhone.trim()) {
        alert(t('donate.val_required'));
        return;
      }
      if (!/\S+@\S+\.\S+/.test(donorEmail)) {
        alert(t('donate.val_email'));
        return;
      }
      const phoneClean = donorPhone.replace(/[\s-]/g, '');
      if (phoneClean.length < 9 || phoneClean.length > 15 || !/^\+?\d+$/.test(phoneClean)) {
        alert(t('donate.val_phone'));
        return;
      }
      const icClean = donorIC.replace(/[\s-]/g, '');
      if (icClean && icClean.length < 6) {
        alert(t('donate.val_ic'));
        return;
      }
    }
    setStep(s => Math.min(s + 1, 5));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const totalAmount = donationAmount;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-12 px-4 font-sans text-brand-slate">

      {/* 💳 DONATION WIZARD CONTAINER */}
      <div className="max-w-5xl mx-auto animate-fade-in">

        {/* HOW YOUR DONATION WORKS (Transparency Layer) */}
        <div className="grid grid-cols-3 gap-4 mb-10 border-b border-brand-pale pb-10">
          {[
            { icon: Grab, title: t('donate.how_step1_title'), desc: t('donate.how_step1_desc') },
            { icon: Lock, title: t('donate.how_step2_title'), desc: t('donate.how_step2_desc') },
            { icon: Flag, title: t('donate.how_step3_title'), desc: t('donate.how_step3_desc') },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center group">
              <div className="h-10 w-10 md:h-16 md:w-16 bg-brand-pale/50 rounded-full flex items-center justify-center mb-3 md:mb-6 text-brand-navy group-hover:bg-brand-cyan transition-colors">
                <Icon className="h-5 w-5 md:h-8 md:w-8" />
              </div>
              <div className="font-black text-brand-navy uppercase tracking-widest text-[9px] md:text-xs mb-1">{title}</div>
              <div className="text-[10px] md:text-sm text-brand-slate font-medium hidden sm:block">{desc}</div>
            </div>
          ))}
        </div>

        {/* Progress Stepper — 5 steps */}
        <div className="flex items-center justify-between mb-8 px-2 sm:px-4 max-w-2xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-black text-xs md:text-sm transition-all shadow-md
                ${step >= i ? 'bg-brand-navy text-white scale-110' : 'bg-white text-slate-300 border border-slate-200'}
              `}>
                {step > i ? <CheckCircle2 className="h-4 w-4" /> : i}
              </div>
              {i < 5 && (
                <div
                  className={`h-2 w-4 sm:w-8 md:w-16 mx-1 transition-colors relative ${step > i ? 'text-brand-cyan' : 'text-slate-200'}`}
                  style={{ backgroundImage: `repeating-linear-gradient(90deg, currentColor 0, currentColor 2px, transparent 2px, transparent 6px)` }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* MAIN FORM PANEL — Step indicator */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-brand-navy/5 p-6 sm:p-10 md:p-14 border border-brand-grey/20 min-h-[500px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-cyan"></div>

              {/* STEP 1: INTERACTIVE AMOUNT SLIDER + IMPACT CARDS */}
              {step === 1 && (
                <DonationSliderStep amount={donationAmount} onChange={setDonationAmount} />
              )}

              {/* STEP 2: SUPPORTING CYCLIST SELECTOR */}
              {step === 2 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-2xl sm:text-4xl font-black text-brand-navy mb-3 tracking-tighter leading-none font-heading">
                    Who are you supporting?
                  </h2>
                  <p className="text-sm text-brand-slate font-medium mb-8">
                    Dedicate your donation to a specific cyclist, or donate to the general fund.
                  </p>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <button
                      onClick={() => setSelectedRider(null)}
                      className={`px-6 py-4 rounded-2xl font-bold text-sm shadow-lg uppercase tracking-widest transition-all ${
                        selectedRider === null
                          ? 'bg-brand-navy text-white scale-105 shadow-brand-navy/20'
                          : 'bg-white text-brand-navy border-2 border-slate-200 hover:border-brand-cyan'
                      }`}
                    >
                      {t('donate.step1_general')}
                    </button>
                    {cyclists.map((c: any) => (
                      <button
                        key={c._id}
                        onClick={() => setSelectedRider(c._id)}
                        className={`px-6 py-4 flex items-center gap-3 rounded-2xl font-bold text-sm shadow-lg uppercase tracking-widest transition-all ${
                          selectedRider === c._id
                            ? 'bg-brand-cyan text-brand-navy scale-105'
                            : 'bg-white text-slate-500 border-2 border-slate-200 hover:border-brand-cyan'
                        }`}
                      >
                        {c.profileUrl && <img src={c.profileUrl} alt={c.name} className="w-8 h-8 rounded-full object-cover" />}
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: PERSONAL INFO */}
              {step === 3 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-2xl sm:text-4xl font-black text-brand-navy mb-3 tracking-tighter leading-none font-heading">{t('donate.step2_heading')}</h2>
                  <p className="text-sm sm:text-base text-brand-slate font-medium mb-8">{t('donate.step2_sub')}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6">
                    <div className="bg-brand-pale/30 p-4 sm:p-6 rounded-2xl border border-brand-pale mb-0 md:mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-brand-navy flex items-center justify-center text-white shrink-0">
                          <Heart size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-brand-slate uppercase tracking-widest mb-1">{t('donate.step2_beneficiary')}</div>
                          <div className="font-black text-brand-navy text-lg">
                            {selectedRider ? cyclists.find((c: any) => c._id === selectedRider)?.name || 'General Fund (SAB2026)' : 'General Fund (SAB2026)'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('donate.step2_name_label')} <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder={t('donate.step2_name_placeholder')}
                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('donate.step2_email_label')} <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder={t('donate.step2_email_placeholder')}
                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('donate.step2_phone_label')} <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder={t('donate.step2_phone_placeholder')}
                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('donate.step2_ic_label')} <span className="text-slate-300 text-[9px] normal-case">{t('donate.step2_ic_optional')}</span></label>
                      <input
                        type="text"
                        value={donorIC}
                        onChange={(e) => setDonorIC(e.target.value)}
                        placeholder={t('donate.step2_ic_placeholder')}
                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-brand-cyan/5 p-6 rounded-3xl border border-brand-cyan/20 flex items-start gap-4">
                    <Lock className="h-6 w-6 text-brand-cyan flex-shrink-0 mt-1" />
                    <p className="text-xs text-brand-navy/70 font-bold leading-relaxed">Your data is encrypted and handled according to PDPA 2010. We only use it for issuing receipts and donation verification.</p>
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT METHOD */}
              {step === 4 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-2xl sm:text-4xl font-black text-brand-navy mb-3 tracking-tighter leading-none font-heading">{t('donate.step3_heading')}</h2>
                  <p className="text-sm sm:text-base text-brand-slate font-medium mb-8">{t('donate.step3_sub')}</p>

                  <div className="space-y-4 mb-10">
                    {[
                      { id: 'HITPAY', name: t('donate.step3_hitpay_name'), icon: ExternalLink, subtitle: t('donate.step3_hitpay_sub') },
                      { id: 'TRANSFER', name: t('donate.step3_transfer_name'), icon: CreditCard, subtitle: t('donate.step3_transfer_sub') }
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as 'HITPAY' | 'TRANSFER')}
                        className={`w-full flex items-center justify-between p-4 sm:p-8 rounded-2xl sm:rounded-3xl border-4 transition-all
                          ${paymentMethod === method.id
                            ? 'border-brand-navy bg-brand-navy text-white shadow-2xl shadow-brand-navy/30'
                            : 'border-slate-50 bg-slate-50 hover:border-brand-cyan/20 text-brand-navy'
                          }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-6">
                          <div className={`h-10 w-10 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${paymentMethod === method.id ? 'bg-brand-cyan text-brand-navy' : 'bg-white text-brand-cyan'}`}>
                            <method.icon className="h-5 w-5 sm:h-8 sm:w-8" />
                          </div>
                          <div className="text-left">
                            <div className="text-base sm:text-xl font-black font-heading">{method.name}</div>
                            <div className="text-[9px] sm:text-xs font-bold uppercase tracking-widest opacity-60">{method.subtitle}</div>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 shrink-0 ${paymentMethod === method.id ? 'text-brand-cyan' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 justify-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('donate.step3_processed_by')}</span>
                    <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-brand-orange animate-pulse"></div>
                      <span className="text-xs font-black text-brand-navy">HITPAY</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: THANK YOU / ACTION */}
              {step === 5 && (
                <div className="animate-fade-in text-center py-10 flex flex-col items-center">

                  {/* PAYMENT SWITCHER (New) */}
                  <div className="mb-12 flex items-center bg-slate-100 p-1.5 rounded-2xl">
                    <button
                      onClick={() => setPaymentMethod('HITPAY')}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'HITPAY' ? 'bg-white text-brand-navy shadow-md' : 'text-slate-500 hover:text-brand-navy'}`}
                    >
                      {t('donate.step4_hitpay_tab')}
                    </button>
                    <button
                      onClick={() => setPaymentMethod('TRANSFER')}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'TRANSFER' ? 'bg-white text-brand-navy shadow-md' : 'text-slate-500 hover:text-brand-navy'}`}
                    >
                      {t('donate.step4_transfer_tab')}
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="ml-4 px-4 py-3 text-brand-cyan hover:text-brand-orange transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  </div>

                  {paymentMethod === 'HITPAY' ? (
                    <div className="max-w-md mx-auto animate-fade-in">
                      <div className="h-24 w-24 bg-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <ExternalLink className="h-10 w-10 text-brand-cyan" />
                        <div className="absolute inset-0 rounded-full border-4 border-brand-cyan animate-ping opacity-20"></div>
                      </div>
                      <h2 className="text-5xl font-black text-brand-navy mb-4 tracking-tighter font-heading">{t('donate.step4_hitpay_heading')}</h2>
                      <p className="text-lg text-brand-slate font-medium mb-12">{t('donate.step4_hitpay_sub')} <span className="text-brand-navy font-bold text-xl">RM {totalAmount.toLocaleString()}</span>.</p>

                      <button
                        id="hitpay-btn"
                        onClick={async () => {
                          try {
                            const ref = 'SAB-' + Date.now();
                            try {
                              await addDonation({
                                amount: totalAmount,
                                name: donorName,
                                email: donorEmail,
                                phone: donorPhone,
                                icNumber: donorIC,
                                type: 'hitpay',
                                reference: ref,
                                riderId: selectedRider || undefined
                              });
                            } catch (err) {
                              console.error('Failed to create pending record:', err);
                            }

                            const beneficiaryName = selectedRider ? cyclists.find((c: any) => c._id === selectedRider)?.name || 'General' : 'General';
                            const result = await createPaymentLink({
                              amount: totalAmount,
                              name: donorName,
                              email: donorEmail,
                              purpose: `Donation for SAB2026 (Fund: ${beneficiaryName})`,
                              reference: ref,
                              siteUrl: window.location.origin
                            });

                            if (result && result.url) {
                              window.location.href = result.url;
                            } else {
                              alert(t('donate.err_init'));
                            }
                          } catch (e) {
                            alert(t('donate.err_server'));
                            console.error(e);
                          }
                        }}
                        className="w-full bg-brand-navy text-white text-xl font-black py-8 rounded-[2.5rem] shadow-2xl hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-4 group uppercase tracking-widest"
                      >
                        {t('donate.step4_proceed')}
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </button>

                      <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest">Visa</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Mastercard</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">FPX</span>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-5xl mx-auto animate-fade-in px-0">
                      {/* Manual Transfer View */}
                      <div className="h-24 w-24 bg-brand-cyan rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow shadow-xl">
                        <CheckCircle2 className="h-12 w-12 text-brand-navy" />
                      </div>
                      <h2 className="text-5xl font-black text-brand-navy mb-4 tracking-tighter">{t('donate.step4_transfer_heading')}</h2>
                      <p className="text-xl text-slate-500 font-medium mb-8">{t('donate.step4_transfer_sub')}</p>

                      <div className="bg-brand-navy rounded-2xl p-6 flex items-center gap-4 mb-10 shadow-xl border border-brand-cyan/20 animate-pulse">
                        <AlertCircle className="h-8 w-8 text-brand-cyan shrink-0" />
                        <div className="text-xs font-black text-white uppercase tracking-widest leading-relaxed">
                          {t('donate.step4_warning')}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 text-left shadow-inner">
                        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                          <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Name</div>
                            <div className="text-base sm:text-lg font-black text-brand-navy leading-tight">UOB Malaysia</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Holder</div>
                            <div className="text-base sm:text-lg font-black text-brand-navy leading-tight">MMA Foundation</div>
                          </div>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center justify-between mb-8 shadow-sm">
                          <div>
                            <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest mb-1">Account Number</div>
                            <div className="text-2xl font-black text-brand-navy tracking-widest">240305 7985</div>
                          </div>
                          <button
                            onClick={() => handleCopy('2403057985')}
                            className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-navy hover:text-white transition-all shadow-sm"
                          >
                            {copied ? <CheckCircle2 className="h-5 w-5 text-brand-cyan" /> : <Copy className="h-5 w-5" />}
                          </button>
                        </div>

                        <div className="space-y-4">
                          <button
                            onClick={async () => {
                              try {
                                const ref = 'SAB-MAN-' + Date.now();
                                await addDonation({
                                  amount: totalAmount,
                                  name: donorName,
                                  email: donorEmail,
                                  phone: donorPhone,
                                  icNumber: donorIC,
                                  type: 'manual',
                                  reference: ref,
                                  riderId: selectedRider || undefined
                                });
                              } catch (err) {
                                console.error('Failed to create pending manual record:', err);
                              }

                              const beneficiaryName = selectedRider ? cyclists.find((c: any) => c._id === selectedRider)?.name || 'General' : 'General';
                              const text = encodeURIComponent(`Hi MMA Foundation, I have made a manual transfer of RM ${totalAmount} for SAB2026.\n\nName: ${donorName}\nPhone: ${donorPhone}\nEmail: ${donorEmail}\nBeneficiary: ${beneficiaryName}\nRef: SAB2026\n\nPlease find my receipt attached.`);
                              window.open(`https://wa.me/60145139470?text=${text}`, '_blank');
                            }}
                            className="w-full bg-[#25D366] text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 hover:bg-[#128C7E] uppercase tracking-widest text-sm mb-4"
                          >
                            <Flag className="h-5 w-5" />
                            Send Receipt via WhatsApp
                          </button>

                          <div className="relative group">
                            <input
                              type="file"
                              id="receipt-upload"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  try {
                                    await addDonation({
                                      amount: totalAmount,
                                      name: donorName,
                                      email: donorEmail,
                                      phone: donorPhone,
                                      icNumber: donorIC,
                                      type: 'manual',
                                      message: 'Manual Transfer Receipt Upload',
                                      reference: 'Manual-' + Date.now()
                                    });
                                    alert("Thank you! Your donation of RM " + totalAmount + " has been recorded.\n\nPlease also email your receipt to sab2026@mma.org.my with subject 'SAB2026 Manual Receipt' for verification.");
                                  } catch (err) {
                                    console.error(err);
                                    alert("Please email your receipt to sab2026@mma.org.my with subject 'SAB2026 Manual Receipt' for verification.");
                                  }
                                }
                              }}
                            />
                            <div className="w-full bg-brand-cyan text-brand-navy font-black py-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group-hover:bg-brand-navy group-hover:text-white uppercase tracking-widest text-sm">
                              <Flag className="h-5 w-5" />
                              Click to Upload Receipt (Email)
                            </div>
                          </div>
                          <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">PDF, JPG, or PNG (Max 5MB)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-6 sm:mt-10 flex items-center justify-between pt-6 sm:pt-10 border-t border-slate-50">
                {step > 1 && step < 5 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 text-brand-navy font-black text-xs uppercase tracking-widest hover:text-brand-orange transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> {t('donate.back')}
                  </button>
                )}
                {step === 1 && (
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('donate.step_indicator')}</div>
                )}
                {step < 5 && (
                  <button
                    onClick={nextStep}
                    disabled={step === 1 && totalAmount < 1}
                    className={`ml-auto flex items-center gap-3 bg-brand-navy text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-brand-navy/20
                      ${step === 1 && totalAmount < 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-cyan hover:text-brand-navy hover:-translate-y-1'}
                    `}
                  >
                    {step === 4 ? 'Complete Donation' : 'Continue'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR: IMPACT SUMMARY */}
          <div className="lg:col-span-4 space-y-8">

            {/* Real-time Impact View */}
            <div className="bg-brand-navy rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-brand-cyan/20 blur-[80px] rounded-full z-0"></div>
              <div className="relative z-10">
                <div className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.3em] mb-6 decoration-brand-cyan/50 underline underline-offset-8">{t('donate.sidebar_summary')}</div>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{t('donate.sidebar_donation')}</span>
                    <span className="text-2xl font-black text-white font-heading">RM {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{t('donate.sidebar_sponsoring')}</span>
                    <span className="text-sm font-black text-brand-cyan tracking-wider text-right max-w-[150px]">
                      {t('donate.sidebar_general')}
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-cyan rounded-2xl flex items-center justify-center text-brand-navy shadow-[0_0_20px_rgba(0,174,239,0.3)]">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest leading-none">{t('donate.sidebar_tax_label')}</div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-bold">{t('donate.sidebar_tax_desc')}</p>
                </div>
              </div>
            </div>

            {/* Testimonial Badge */}
            <div className="bg-white rounded-[2rem] p-8 border border-brand-grey/20 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-black text-brand-navy">{t('donate.testimonial_name')}</div>
                  <div className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">{t('donate.testimonial_role')}</div>
                </div>
              </div>
              <p className="text-xs text-brand-slate font-medium italic leading-relaxed">{t('donate.testimonial_quote')}</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Donate;