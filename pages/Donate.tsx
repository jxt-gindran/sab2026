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
  Landmark,
  Grab,
  Lock,
  Flag
} from 'lucide-react';

import { useAction, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

import ridersData from '../data/riders.json';

const IMPACT_TIERS = [
  { amount: 50, label: "Care Bundle", description: "Essential hygiene kits for recovery." },
  { amount: 150, label: "Immune Support", description: "Diagnostic tests for deficiency." },
  { amount: 500, label: "Surgery Fund", description: "O.T. consumables for one child." },
  { amount: 1200, label: "Full Hero", description: "Complete surgery + post-op care." },
];

const Donate: React.FC = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedRider, setSelectedRider] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'HITPAY' | 'TRANSFER' | null>(null);
  const [copied, setCopied] = useState(false);

  // Convex Hooks
  const createPaymentLink = useAction(api.payments.createLink);
  const addDonation = useMutation(api.donations.add);

  // Form State
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorIC, setDonorIC] = useState('');

  // Check if a rider was passed in the URL (e.g. from Home page)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // const riderId = params.get('rider');
    // if (riderId) {
    //   setSelectedRider(parseInt(riderId));
    // }
    const beneficiary = params.get('beneficiary');
    // Logic for beneficiary handling if needed (currently rider focused)
  }, [location]);

  const nextStep = () => {
    if (step === 2) {
      if (!donorName.trim() || !donorEmail.trim() || !donorPhone.trim()) {
        alert('Name, Email, and Phone Number are mandatory.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(donorEmail)) {
        alert('Please enter a valid email address.');
        return;
      }
      // Simple phone validation (e.g. +60 or 01...)
      const phoneClean = donorPhone.replace(/[\s-]/g, '');
      if (phoneClean.length < 9 || phoneClean.length > 15 || !/^\+?\d+$/.test(phoneClean)) {
        alert('Please enter a valid phone number (e.g. +60123456789).');
        return;
      }
      // IC Validation - Optional but validate format if provided
      const icClean = donorIC.replace(/[\s-]/g, '');
      if (icClean && icClean.length < 6) {
        alert('Please enter a valid IC / Passport Number (at least 6 characters).');
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const totalAmount = selectedAmount || parseFloat(customAmount) || 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white py-24 px-4 font-sans text-brand-slate">

      {/* 💳 DONATION WIZARD CONTAINER */}
      <div className="max-w-5xl mx-auto animate-fade-in">

        {/* HOW YOUR DONATION WORKS (Transparency Layer) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-b border-brand-pale pb-12">
          <div className="flex flex-col items-center text-center group">
            <div className="h-16 w-16 bg-brand-pale/50 rounded-full flex items-center justify-center mb-6 text-brand-navy group-hover:bg-brand-cyan group-hover:text-brand-navy transition-colors">
              <Grab className="h-8 w-8" />
            </div>
            <div className="font-black text-brand-navy uppercase tracking-widest text-xs mb-2">Select a Cause</div>
            <div className="text-sm text-brand-slate font-medium max-w-xs">Choose to support the General Fund or a specific Rider.</div>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="h-16 w-16 bg-brand-pale/50 rounded-full flex items-center justify-center mb-6 text-brand-navy group-hover:bg-brand-cyan group-hover:text-brand-navy transition-colors">
              <Lock className="h-8 w-8" />
            </div>
            <div className="font-black text-brand-navy uppercase tracking-widest text-xs mb-2">100% Secure</div>
            <div className="text-sm text-brand-slate font-medium max-w-xs">Funds go directly to the MMA Foundation (Tax Exempt).</div>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="h-16 w-16 bg-brand-pale/50 rounded-full flex items-center justify-center mb-6 text-brand-navy group-hover:bg-brand-cyan group-hover:text-brand-navy transition-colors">
              <Flag className="h-8 w-8" />
            </div>
            <div className="font-black text-brand-navy uppercase tracking-widest text-xs mb-2">Receive Receipt</div>
            <div className="text-sm text-brand-slate font-medium max-w-xs">Get your LHDN-compliant tax exemption receipt instantly.</div>
          </div>
        </div>

        {/* Progress Stepper */}

        <div className="flex items-center justify-between mb-12 px-8 max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center group">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm transition-all shadow-lg
                ${step >= i ? 'bg-brand-navy text-white scale-110' : 'bg-white text-slate-300 border border-slate-200'}
              `}>
                {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
              </div>
              {i < 4 && (
                <div
                  className={`h-3 w-12 mx-2 md:w-24 transition-colors relative ${step > i ? 'text-brand-cyan' : 'text-slate-200'}`}
                  style={{
                    backgroundImage: `repeating-linear-gradient(90deg, currentColor 0, currentColor 2px, transparent 2px, transparent 6px)`
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* MAIN FORM PANEL */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-navy/5 p-10 md:p-14 border border-brand-grey/20 min-h-[600px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-cyan"></div>

              {/* STEP 1: AMOUNT & BENEFICIARY */}
              {step === 1 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-4xl font-black text-brand-navy mb-4 tracking-tighter leading-none font-heading">Choose Your Impact.</h2>
                  <p className="text-brand-slate font-medium mb-12">Select an amount or enter your own. Every ringgit counts towards a life-saving surgery.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {IMPACT_TIERS.map((tier) => (
                      <button
                        key={tier.amount}
                        onClick={() => { setSelectedAmount(tier.amount); setCustomAmount(''); }}
                        className={`text-left p-6 rounded-3xl border-4 transition-all group relative overflow-hidden
                          ${selectedAmount === tier.amount
                            ? 'border-brand-cyan bg-brand-navy'
                            : 'border-slate-50 bg-slate-50 hover:border-brand-cyan/30'
                          }`}
                      >
                        <div className={`text-3xl font-black mb-1 font-heading ${selectedAmount === tier.amount ? 'text-brand-cyan' : 'text-brand-navy'}`}>
                          RM {tier.amount}
                        </div>
                        <div className={`font-black uppercase tracking-widest text-[10px] mb-3 ${selectedAmount === tier.amount ? 'text-white/60' : 'text-slate-400'}`}>
                          {tier.label}
                        </div>
                        <p className={`text-xs leading-relaxed font-medium ${selectedAmount === tier.amount ? 'text-brand-pale' : 'text-slate-500'}`}>
                          {tier.description}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="relative mb-12">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-xl text-slate-400">RM</span>
                    <input
                      type="number"
                      placeholder="Other Amount"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                      className="w-full bg-slate-50 border-4 border-slate-50 rounded-3xl pl-16 pr-8 py-6 text-2xl font-black text-brand-navy focus:border-brand-cyan outline-none transition-all placeholder:text-slate-200"
                    />
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Supporting:</h3>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setSelectedRider(null)}
                        className="px-6 py-3 rounded-xl font-bold text-xs bg-brand-navy text-white shadow-lg uppercase tracking-widest transition-all"
                      >
                        General Fund (SAB2026)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL INFO */}
              {step === 2 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-4xl font-black text-brand-navy mb-4 tracking-tighter leading-none font-heading">Who's building hope?</h2>
                  <p className="text-brand-slate font-medium mb-12">We need your details for the official tax receipt (LHDN).</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-brand-pale/30 p-6 rounded-2xl border border-brand-pale mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-brand-navy flex items-center justify-center text-white shrink-0">
                          <Heart size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-brand-slate uppercase tracking-widest mb-1">Beneficiary</div>
                          <div className="font-black text-brand-navy text-lg">General Fund (SAB2026)</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name (as per IC) <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="e.g. Ahmad bin Ali"
                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="ahmad@example.com"
                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        placeholder="+60 12 345 6789"
                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IC / Passport Number <span className="text-slate-300 text-[9px] normal-case">(optional, for tax receipt)</span></label>
                      <input
                        type="text"
                        value={donorIC}
                        onChange={(e) => setDonorIC(e.target.value)}
                        placeholder="Optional — for Tax Exemption Receipt"
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

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-4xl font-black text-brand-navy mb-4 tracking-tighter leading-none font-heading">The Final Step.</h2>
                  <p className="text-brand-slate font-medium mb-12">Select your preferred payment method via our secure HitPay gateway.</p>

                  <div className="space-y-4 mb-10">
                    {[
                      { id: 'HITPAY', name: 'HitPay Checkout', icon: ExternalLink, subtitle: 'FPX, Cards, GrabPay, ShopeePay' },
                      { id: 'TRANSFER', name: 'Manual Bank Transfer', icon: CreditCard, subtitle: 'UOB Direct (WhatsApp / Email Proof)' }
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as 'HITPAY' | 'TRANSFER')}
                        className={`w-full flex items-center justify-between p-8 rounded-3xl border-4 transition-all
                          ${paymentMethod === method.id
                            ? 'border-brand-navy bg-brand-navy text-white shadow-2xl shadow-brand-navy/30'
                            : 'border-slate-50 bg-slate-50 hover:border-brand-cyan/20 text-brand-navy'
                          }`}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-brand-cyan text-brand-navy' : 'bg-white text-brand-cyan'}`}>
                            <method.icon className="h-8 w-8" />
                          </div>
                          <div className="text-left">
                            <div className="text-xl font-black font-heading">{method.name}</div>
                            <div className={`text-xs font-bold uppercase tracking-widest opacity-60`}>{method.subtitle}</div>
                          </div>
                        </div>
                        <ChevronRight className={`h-6 w-6 ${paymentMethod === method.id ? 'text-brand-cyan' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 justify-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Securely processed by</span>
                    <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-brand-orange animate-pulse"></div>
                      <span className="text-xs font-black text-brand-navy">HITPAY</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: THANK YOU / ACTION */}
              {step === 4 && (
                <div className="animate-fade-in text-center py-10 flex flex-col items-center">

                  {/* PAYMENT SWITCHER (New) */}
                  <div className="mb-12 flex items-center bg-slate-100 p-1.5 rounded-2xl">
                    <button
                      onClick={() => setPaymentMethod('HITPAY')}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'HITPAY' ? 'bg-white text-brand-navy shadow-md' : 'text-slate-500 hover:text-brand-navy'}`}
                    >
                      HitPay
                    </button>
                    <button
                      onClick={() => setPaymentMethod('TRANSFER')}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'TRANSFER' ? 'bg-white text-brand-navy shadow-md' : 'text-slate-500 hover:text-brand-navy'}`}
                    >
                      Manual Transfer
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
                      <h2 className="text-5xl font-black text-brand-navy mb-4 tracking-tighter font-heading">Ready to Redirect.</h2>
                      <p className="text-lg text-brand-slate font-medium mb-12">Click below to proceed to the secure HitPay gateway and complete your donation of <span className="text-brand-navy font-bold text-xl">RM {totalAmount.toLocaleString()}</span>.</p>

                      <button
                        id="hitpay-btn"
                        onClick={async () => {
                          try {
                            const result = await createPaymentLink({
                              amount: totalAmount,
                              name: donorName,
                              email: donorEmail,
                              purpose: `Donation for SAB2026 (Fund: General)`,
                              reference: 'SAB-' + Date.now()
                            });

                            if (result && result.url) {
                              window.location.href = result.url;
                            } else {
                              alert('Payment initialization failed. Please try again.');
                            }
                          } catch (e) {
                            alert('Error connecting to payment server. Please try again.');
                            console.error(e);
                          }
                        }}
                        className="w-full bg-brand-navy text-white text-xl font-black py-8 rounded-[2.5rem] shadow-2xl hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-4 group uppercase tracking-widest"
                      >
                        Proceed to Checkout
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </button>

                      <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest">Visa</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Mastercard</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">FPX</span>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-xl mx-auto animate-fade-in">
                      {/* Manual Transfer View */}
                      <div className="h-24 w-24 bg-brand-cyan rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow shadow-xl">
                        <CheckCircle2 className="h-12 w-12 text-brand-navy" />
                      </div>
                      <h2 className="text-5xl font-black text-brand-navy mb-4 tracking-tighter">Heart of Gold.</h2>
                      <p className="text-xl text-slate-500 font-medium mb-8">Please complete your manual transfer to the MMA Foundation account below.</p>

                      <div className="bg-brand-navy rounded-2xl p-6 flex items-center gap-4 mb-10 shadow-xl border border-brand-cyan/20 animate-pulse">
                        <AlertCircle className="h-8 w-8 text-brand-cyan shrink-0" />
                        <div className="text-xs font-black text-white uppercase tracking-widest leading-relaxed">
                          IMPORTANT: Please put "SAB2026" as your recipient reference for automated verification.
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 text-left shadow-inner">
                        <div className="grid grid-cols-2 gap-8 mb-8">
                          <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Name</div>
                            <div className="text-lg font-black text-brand-navy leading-tight">UOB Malaysia</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Holder</div>
                            <div className="text-lg font-black text-brand-navy leading-tight">MMA Foundation</div>
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
                            onClick={() => {
                              // Manual WhatsApp logic
                              const text = encodeURIComponent(`Hi MMA Foundation, I have made a manual transfer of RM ${totalAmount} for SAB2026.\n\nName: ${donorName}\nPhone: ${donorPhone}\nEmail: ${donorEmail}\nRef: SAB2026\n\nPlease find my receipt attached.`);
                              window.open(`https://wa.me/60122296678?text=${text}`, '_blank');
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
                                      message: 'Manual Transfer Receipt Upload',
                                      reference: 'Manual-' + Date.now()
                                    });
                                    alert("Thank you! Your donation of RM " + totalAmount + " has been recorded.\n\nPlease also email your receipt to foundation@mma.org.my with subject 'SAB2026 Manual Receipt' for verification.");
                                  } catch (err) {
                                    console.error(err);
                                    alert("Please email your receipt to foundation@mma.org.my with subject 'SAB2026 Manual Receipt' for verification.");
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
              <div className="mt-10 flex items-center justify-between pt-10 border-t border-slate-50">
                {step > 1 && step < 4 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 text-brand-navy font-black text-xs uppercase tracking-widest hover:text-brand-orange transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                )}
                {step === 1 && (
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Step 1 of 4</div>
                )}
                {step < 4 && (
                  <button
                    onClick={nextStep}
                    disabled={step === 1 && totalAmount === 0}
                    className={`ml-auto flex items-center gap-3 bg-brand-navy text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-brand-navy/20
                      ${step === 1 && totalAmount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-cyan hover:text-brand-navy hover:-translate-y-1'}
                    `}
                  >
                    {step === 3 ? 'Complete Donation' : 'Continue'}
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
                <div className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.3em] mb-6 decoration-brand-cyan/50 underline underline-offset-8">Current Summary</div>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Donation</span>
                    <span className="text-2xl font-black text-white font-heading">RM {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Sponsoring</span>
                    <span className="text-sm font-black text-brand-cyan tracking-wider text-right max-w-[150px]">
                      General Medical Fund
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-cyan rounded-2xl flex items-center justify-center text-brand-navy shadow-[0_0_20px_rgba(0,174,239,0.3)]">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest leading-none">Tax Exempt</div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-bold">All donations to MMA Foundation are tax deductible under Section 44(6) of ITA 1967.</p>
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
                  <div className="text-sm font-black text-brand-navy">Dr. Kevin Tan</div>
                  <div className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">Head of Paediatrics</div>
                </div>
              </div>
              <p className="text-xs text-brand-slate font-medium italic leading-relaxed">"Your donation isn't just a transaction. It's the medicine, the recovery, and the future of a child."</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Donate;