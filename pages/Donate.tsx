import React, { useState } from 'react';
import { Copy, CheckCircle2, AlertCircle, Heart } from 'lucide-react';

const Donate: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  const tiers = [
    { amount: 50, label: "Essential care supplies for vulnerable children." },
    { amount: 150, label: "Diagnostic testing for immune deficiencies." },
    { amount: 300, label: "Post-surgery recovery aid and medication." },
    { amount: 500, label: "Surgical consumables for complex procedures." },
    { amount: 1000, label: "Life-saving intervention fund." },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText('2403057985');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTierClick = (amount: number) => {
    setSelectedTier(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedTier(null);
  };

  const displayAmount = selectedTier || (customAmount ? customAmount : '0');

  return (
    <div className="py-16 bg-slate-50 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-7xl w-full mx-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Make a Difference Today</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Your contribution directly funds life-saving surgeries and immune treatments.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Donation Stack Widget */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8 order-1 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-full">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Select Your Impact</h2>
            </div>
            
            <div className="space-y-4">
              {tiers.map((tier) => (
                <button
                  key={tier.amount}
                  onClick={() => handleTierClick(tier.amount)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group
                    ${selectedTier === tier.amount 
                      ? 'border-orange-500 bg-orange-50 shadow-md ring-1 ring-orange-200' 
                      : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/30'
                    }`}
                >
                  <span className={`text-xl font-bold group-hover:text-orange-700 ${selectedTier === tier.amount ? 'text-orange-700' : 'text-slate-700'}`}>
                    RM {tier.amount}
                  </span>
                  <span className={`text-sm sm:text-right group-hover:text-orange-800 ${selectedTier === tier.amount ? 'text-orange-800 font-medium' : 'text-slate-500'}`}>
                    {tier.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-2">Other Amount (RM)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">RM</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter custom amount"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-slate-900 text-lg placeholder:font-normal"
                />
              </div>
            </div>
            
            {/* Amount Confirmation Display */}
             <div className="mt-8 bg-slate-900 text-white p-6 rounded-xl text-center shadow-lg transition-all duration-300">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Total Donation</p>
                <div className="flex items-center justify-center gap-1">
                   <span className="text-2xl font-bold text-orange-400 mt-2">RM</span>
                   <span className="text-5xl font-extrabold text-white">{displayAmount}</span>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Please transfer this amount using the details <span className="hidden lg:inline">on the right</span><span className="lg:hidden">below</span>.
                </p>
             </div>
          </div>

          {/* Bank Transfer Details */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 order-2 lg:order-2">
            <div className="bg-sab p-6 text-center">
              <h2 className="text-white text-xl font-semibold">Bank Transfer Details</h2>
              <p className="text-teal-100 text-sm mt-1">Preferred Method</p>
            </div>
            
            <div className="p-8 md:p-12 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bank</label>
                  <div className="text-lg font-medium text-slate-900">United Overseas Bank (Malaysia) Bhd</div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account Name</label>
                  <div className="text-lg font-medium text-slate-900">MMA Foundation Donation - 1</div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 flex flex-col justify-between items-start gap-4">
                 <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <label className="block text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Account Number</label>
                        <div className="text-3xl font-mono font-bold text-slate-900 tracking-wider">240305 798 5</div>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-slate-600 font-medium"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Swift Code</label>
                  <div className="text-lg font-medium text-slate-900 font-mono">UOVBMYKL</div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reference</label>
                  <div className="text-lg font-medium text-slate-900">SAB2026 Donation</div>
                </div>
              </div>

            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-100">
               <div className="flex items-start gap-3">
                 <AlertCircle className="w-6 h-6 text-sab flex-shrink-0 mt-0.5" />
                 <div>
                   <h3 className="font-bold text-slate-900">Tax Exemption Info</h3>
                   <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                     All donations are tax-deductible. For official receipts, please contact <br/>
                     <span className="font-semibold text-slate-900">+60 14 513 9470</span> or <span className="font-semibold text-slate-900">+60 3 404 113 75 (ext. 113)</span>.
                   </p>
                 </div>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Donate;