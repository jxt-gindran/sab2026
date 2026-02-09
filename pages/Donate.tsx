import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Heart,
  User,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const RIDERS = [
  { id: 1, name: 'Dr. Ahmad Rizal', role: 'Paediatric Surgeon' },
  { id: 2, name: 'Sarah Chen', role: 'Endurance Cyclist' },
  { id: 3, name: 'Lt. Murali Kumar', role: 'Retired Officer' }
];

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
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'FPX' | 'PAYPAL' | null>(null);
  const [copied, setCopied] = useState(false);

  // Check if a rider was passed in the URL (e.g. from Home page)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const riderId = params.get('rider');
    if (riderId) {
      setSelectedRider(parseInt(riderId));
    }
  }, [location]);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const totalAmount = selectedAmount || parseFloat(customAmount) || 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 font-['Inter']">

      {/* 💳 DONATION WIZARD CONTAINER */}
      <div className="max-w-5xl mx-auto">

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
                <div className={`h-1 w-12 mx-2 md:w-24 rounded-full transition-colors ${step > i ? 'bg-brand-cyan' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* MAIN FORM PANEL */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-navy/5 p-10 md:p-14 border border-slate-100 min-h-[600px] flex flex-col">

              {/* STEP 1: AMOUNT & BENEFICIARY */}
              {step === 1 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-4xl font-black text-brand-navy mb-4 tracking-tighter leading-none">Choose Your Impact.</h2>
                  <p className="text-slate-500 font-medium mb-12">Select an amount or enter your own. Every ringgit counts towards a life-saving surgery.</p>

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
                        <div className={`text-3xl font-black mb-1 ${selectedAmount === tier.amount ? 'text-brand-cyan' : 'text-brand-navy'}`}>
                          RM {tier.amount}
                        </div>
                        <div className={`font-black uppercase tracking-widest text-[10px] mb-3 ${selectedAmount === tier.amount ? 'text-white/60' : 'text-slate-400'}`}>
                          {tier.label}
                        </div>
                        <p className={`text-sm leading-snug font-medium ${selectedAmount === tier.amount ? 'text-slate-300' : 'text-slate-500'}`}>
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
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Support a specific Rider (Optional)</h3>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setSelectedRider(null)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${!selectedRider ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        General Fund
                      </button>
                      {RIDERS.map(rider => (
                        <button
                          key={rider.id}
                          onClick={() => setSelectedRider(rider.id)}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${selectedRider === rider.id ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {rider.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL INFO */}
              {step === 2 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-4xl font-black text-brand-navy mb-4 tracking-tighter leading-none">Who's building hope?</h2>
                  <p className="text-slate-500 font-medium mb-12">We need your details for the official tax receipt (LHDN).</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name (as per IC)</label>
                      <input type="text" placeholder="e.g. Ahmad bin Ali" className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input type="email" placeholder="ahmad@example.com" className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input type="tel" placeholder="+60 12 345 6789" className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">IC / Passport Number</label>
                      <input type="text" placeholder="Required for Tax Exemption" className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all" />
                    </div>
                  </div>

                  <div className="bg-brand-cyan/5 p-6 rounded-3xl border border-brand-cyan/20 flex items-start gap-4">
                    <ShieldCheck className="h-6 w-6 text-brand-cyan flex-shrink-0 mt-1" />
                    <p className="text-sm text-brand-navy/60 font-medium">Your data is encrypted and handled according to PDPA 2010. We only use it for issuing receipts and donation verification.</p>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <div className="animate-fade-in flex-grow">
                  <h2 className="text-4xl font-black text-brand-navy mb-4 tracking-tighter leading-none">The Final Step.</h2>
                  <p className="text-slate-500 font-medium mb-12">Select your preferred donation method. All transactions are secure.</p>

                  <div className="space-y-4 mb-10">
                    {[
                      { id: 'CARD', name: 'Credit / Debit Card', icon: CreditCard, subtitle: 'Visa, Mastercard, AMEX' },
                      { id: 'FPX', name: 'Online Banking (FPX)', icon: ExternalLink, subtitle: 'Maybank2u, CIMB Clicks, etc.' },
                      { id: 'PAYPAL', name: 'PayPal', icon: User, subtitle: 'International & secure' }
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`w-full flex items-center justify-between p-8 rounded-3xl border-4 transition-all
                          ${paymentMethod === method.id
                            ? 'border-brand-cyan bg-brand-navy text-white'
                            : 'border-slate-50 bg-slate-50 hover:border-brand-cyan/20 text-brand-navy'
                          }`}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-brand-cyan text-brand-navy' : 'bg-white text-brand-cyan'}`}>
                            <method.icon className="h-8 w-8" />
                          </div>
                          <div className="text-left">
                            <div className="text-xl font-black">{method.name}</div>
                            <div className={`text-sm font-bold ${paymentMethod === method.id ? 'text-slate-400' : 'text-slate-400'}`}>{method.subtitle}</div>
                          </div>
                        </div>
                        <ChevronRight className={`h-6 w-6 ${paymentMethod === method.id ? 'text-brand-cyan' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 justify-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-4 w-4" />
                    SECURE 256-BIT SSL ENCRYPTION
                  </div>
                </div>
              )}

              {/* STEP 4: THANK YOU / BANK TRANSFER DETAILS */}
              {step === 4 && (
                <div className="animate-fade-in text-center py-10">
                  <div className="h-24 w-24 bg-brand-cyan rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                    <CheckCircle2 className="h-12 w-12 text-brand-navy" />
                  </div>
                  <h2 className="text-5xl font-black text-brand-navy mb-4 tracking-tighter">Heart of Gold.</h2>
                  <p className="text-xl text-slate-500 font-medium mb-12 max-w-md mx-auto">Thank you for committing RM {totalAmount.toLocaleString()} to our cause. Please complete your transfer below.</p>

                  <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 text-left max-w-xl mx-auto shadow-inner">
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
                        <div className="text-[10px] font-black text-brand-coral uppercase tracking-widest mb-1">Account Number</div>
                        <div className="text-2xl font-black text-brand-navy tracking-widest">240305 7985</div>
                      </div>
                      <button
                        onClick={() => handleCopy('2403057985')}
                        className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-navy hover:text-white transition-all shadow-sm"
                      >
                        {copied ? <CheckCircle2 className="h-5 w-5 text-brand-cyan" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-brand-navy text-white rounded-2xl">
                      <AlertCircle className="h-5 w-5 text-brand-cyan flex-shrink-0" />
                      <p className="text-xs font-bold leading-relaxed opacity-80 uppercase tracking-wider">Please put "SAB2026" as your reference for automated verification.</p>
                    </div>
                  </div>

                  <button className="mt-12 text-brand-navy font-black text-sm uppercase tracking-[0.3em] flex items-center gap-2 mx-auto hover:text-brand-cyan transition-colors">
                    Upload Receipt <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="mt-10 flex items-center justify-between pt-10 border-t border-slate-50">
                {step > 1 && step < 4 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 text-brand-navy font-black text-sm uppercase tracking-widest"
                  >
                    <ArrowLeft className="h-5 w-5" /> Back
                  </button>
                )}
                {step === 1 && (
                  <div className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Step 1 of 4</div>
                )}
                {step < 4 && (
                  <button
                    onClick={nextStep}
                    disabled={step === 1 && totalAmount === 0}
                    className={`ml-auto flex items-center gap-3 bg-brand-navy text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-brand-navy/20
                      ${step === 1 && totalAmount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-cyan hover:text-brand-navy hover:-translate-y-1'}
                    `}
                  >
                    {step === 3 ? 'Complete Donation' : 'Continue'}
                    <ArrowRight className="h-6 w-6" />
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
                    <span className="text-2xl font-black text-white">RM {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Sponsoring</span>
                    <span className="text-sm font-black text-brand-cyan tracking-wider">
                      {selectedRider ? RIDERS.find(r => r.id === selectedRider)?.name : 'General Medical Fund'}
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-cyan rounded-2xl flex items-center justify-center text-brand-navy shadow-[0_0_20px_rgba(0,174,239,0.3)]">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-black uppercase tracking-widest leading-none">Tax Exempt</div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">All donations to MMA Foundation are tax deductible under Section 44(6) of ITA 1967.</p>
                </div>
              </div>
            </div>

            {/* Testimonial Badge */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img src="https://i.pravatar.cc/100?u=doc1" className="h-12 w-12 rounded-xl" alt="Doc" />
                <div>
                  <div className="text-sm font-black text-brand-navy">Dr. Kevin Tan</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Head of Paediatrics</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium italic">"Your donation isn't just a transaction. It's the medicine, the recovery, and the future of a child."</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Donate;