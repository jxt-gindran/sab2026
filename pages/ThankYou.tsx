import React, { useEffect, useState } from 'react';
import {
    Heart,
    Share2,
    Facebook,
    CheckCircle2,
    ArrowRight,
    Copy,
    FileText,
    Building2,
    User,
    Check
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

// Simple WhatsApp Icon component since Lucide doesn't have it explicitly sometimes or varying
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const ThankYou: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [amount, setAmount] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const refParam = searchParams.get('ref') || searchParams.get('reference') || '';
    const donation = useQuery(api.donations.getByRef, refParam ? { ref: refParam } : "skip");
    const requestReceipt = useMutation(api.donations.requestReceipt);

    // Form states
    const [receiptType, setReceiptType] = useState<'none' | 'personal' | 'corporate'>('none');
    
    // Personal fields
    const [receiptName, setReceiptName] = useState('');
    const [receiptIC, setReceiptIC] = useState('');
    const [receiptPhone, setReceiptPhone] = useState('');
    const [receiptAddress, setReceiptAddress] = useState('');
    
    // Corporate fields
    const [receiptCompany, setReceiptCompany] = useState('');
    const [receiptRegNo, setReceiptRegNo] = useState('');
    const [receiptBizAddress, setReceiptBizAddress] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // HitPay redirects with ?status=completed or ?status=failed/canceled
        const status = searchParams.get('status');
        if (status && status !== 'completed') {
            navigate('/payment-cancelled', { replace: true });
            return;
        }
        const amt = searchParams.get('amount');
        if (amt) {
            setAmount(amt);
        } else if (donation) {
            setAmount(donation.amount.toString());
        }
    }, [searchParams, navigate, donation]);

    useEffect(() => {
        if (donation) {
            setReceiptName(donation.receiptName || donation.name || '');
            setReceiptIC(donation.receiptIC || donation.icNumber || '');
            setReceiptPhone(donation.receiptPhone || donation.phone || '');
            // Pre-fill address from upfront donation.address if available
            setReceiptAddress(donation.receiptAddress || (donation as any).address || '');

            
            setReceiptCompany(donation.receiptCompany || '');
            setReceiptRegNo(donation.receiptRegNo || '');
            setReceiptBizAddress(donation.receiptBizAddress || '');
            setContactName(donation.name || '');
            setContactPhone(donation.phone || '');
            setContactEmail(donation.email || '');

            if (donation.receiptRequested) {
                setReceiptType(donation.receiptType as 'personal' | 'corporate' || 'none');
                setSubmitted(true);
            }
        }
    }, [donation]);

    const handleCopy = () => {
        const shareUrl = "https://sab.mma.org.my";
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (receiptType === 'none') return;

        // Validation
        if (receiptType === 'personal') {
            if (!receiptName.trim() || !receiptIC.trim() || !receiptPhone.trim() || !receiptAddress.trim()) {
                alert('Please fill in all required fields.');
                return;
            }
        } else if (receiptType === 'corporate') {
            if (!receiptCompany.trim() || !receiptRegNo.trim() || !receiptBizAddress.trim()) {
                alert('Please fill in all required fields.');
                return;
            }
        }

        setSubmitting(true);
        try {
            await requestReceipt({
                ref: refParam,
                receiptType,
                receiptName: receiptType === 'personal' ? receiptName : undefined,
                receiptIC: receiptType === 'personal' ? receiptIC : undefined,
                receiptPhone: receiptType === 'personal' ? receiptPhone : undefined,
                receiptAddress: receiptType === 'personal' ? receiptAddress : undefined,
                receiptCompany: receiptType === 'corporate' ? receiptCompany : undefined,
                receiptRegNo: receiptType === 'corporate' ? receiptRegNo : undefined,
                receiptBizAddress: receiptType === 'corporate' ? receiptBizAddress : undefined,
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert('Failed to request receipt. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const shareUrl = "https://sab.mma.org.my";
    const shareText = t('thankyou.share_text');

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-sans text-brand-slate">
            <div className="max-w-4xl mx-auto px-6 animate-fade-in text-center">

                {/* Success Icon */}
                <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-12 relative">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                    <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20"></div>
                </div>

                <h1 className="text-6xl md:text-7xl font-black text-brand-navy mb-8 font-heading tracking-tighter leading-none">
                    {t('thankyou.heading')}
                </h1>

                <p className="text-xl md:text-2xl text-brand-slate font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                    {t('thankyou.subtitle_prefix')}{amount ? ` ${t('thankyou.subtitle_amount_prefix')} ${parseFloat(amount).toLocaleString('en-MY', { minimumFractionDigits: 2 })}` : ''} {t('thankyou.subtitle_suffix')}
                </p>

                {/* 🧾 Tax Receipt Section */}
                {refParam && (
                    <div className="max-w-2xl mx-auto mb-16 text-left">
                        {donation === undefined ? (
                            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 text-center animate-pulse">
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading donation details...</p>
                            </div>
                        ) : donation === null ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-[2.5rem] p-8 text-center">
                                <p className="text-orange-600 font-bold mb-2">Donation record not found</p>
                                <p className="text-sm text-slate-500">If you completed a payment, it may take a few moments to sync. If you still need assistance or to request a tax receipt manually, please contact us at <a href="mailto:mmafoundation76@gmail.com" className="underline font-bold text-brand-navy">mmafoundation76@gmail.com</a>.</p>
                            </div>
                        ) : submitted ? (
                            <div className="bg-green-50 border-2 border-green-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-green-900/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <Check className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-brand-navy font-heading">Receipt Request Submitted!</h3>
                                        <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Status: Pending Verification</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                    Your request has been logged. An email has been sent to the administrators at <span className="font-bold text-brand-navy">mmafoundation76@gmail.com</span> &amp; <span className="font-bold text-brand-navy">mmafoundation1976@gmail.com</span>. They will verify your donation amount and issue your official LHDN tax-exempt receipt. <span className="font-semibold text-brand-navy">Please allow up to 30 days for your receipt to be issued.</span>
                                </p>
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                    <h4 className="text-xs font-black text-brand-navy uppercase tracking-widest mb-3 pb-2 border-b border-slate-100">Requested Details</h4>
                                    <table className="w-full text-xs">
                                        <tbody>
                                            {receiptType === 'personal' ? (
                                                <>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider w-1/3">Type</td><td className="py-2 font-black text-brand-navy">Personal (Individual)</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">Full Name</td><td className="py-2 font-black text-brand-navy">{receiptName}</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">NRIC/IC</td><td className="py-2 font-black text-brand-navy">{receiptIC}</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">Phone</td><td className="py-2 font-black text-brand-navy">{receiptPhone}</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">Address</td><td className="py-2 font-black text-brand-navy whitespace-pre-wrap">{receiptAddress}</td></tr>
                                                </>
                                            ) : (
                                                <>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider w-1/3">Type</td><td className="py-2 font-black text-brand-navy">Corporate</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">Company Name</td><td className="py-2 font-black text-brand-navy">{receiptCompany}</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">Reg. No.</td><td className="py-2 font-black text-brand-navy">{receiptRegNo}</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">Address</td><td className="py-2 font-black text-brand-navy whitespace-pre-wrap">{receiptBizAddress}</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">Contact Name</td><td className="py-2 font-black text-brand-navy">{contactName}</td></tr>
                                                    <tr><td className="py-2 text-slate-400 font-bold uppercase tracking-wider">Contact Email</td><td className="py-2 font-black text-brand-navy">{contactEmail}</td></tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-md relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-brand-cyan"></div>
                                <h3 className="text-3xl font-black text-brand-navy mb-2 font-heading tracking-tight">🧾 Request Tax Exemption Receipt</h3>
                                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                    MMA Foundation is approved under Section 44(6) of the Income Tax Act 1967. If you would like to claim a tax deduction for this donation, select the receipt type below. <span className="font-semibold text-brand-navy">Receipts are issued within 30 days of verification.</span>
                                </p>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {[
                                        { id: 'none', label: 'No Receipt', icon: CheckCircle2 },
                                        { id: 'personal', label: 'Personal', icon: User },
                                        { id: 'corporate', label: 'Corporate', icon: Building2 },
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setReceiptType(type.id as any)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 font-bold text-xs uppercase tracking-wider transition-all
                                                ${receiptType === type.id
                                                    ? 'border-brand-navy bg-brand-navy text-white shadow-lg'
                                                    : 'border-slate-200 bg-white hover:border-brand-cyan text-brand-navy'
                                                }`}
                                        >
                                            <type.icon className="h-5 w-5 mb-2" />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>

                                {receiptType !== 'none' && (
                                    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                                        {receiptType === 'personal' ? (
                                            <>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name (as per IC) <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={receiptName}
                                                        onChange={e => setReceiptName(e.target.value)}
                                                        required
                                                        placeholder="Full Name"
                                                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all text-sm"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NRIC/IC Number <span className="text-red-500">*</span></label>
                                                        <input
                                                            type="text"
                                                            value={receiptIC}
                                                            onChange={e => setReceiptIC(e.target.value)}
                                                            required
                                                            placeholder="e.g. 800101-14-5000"
                                                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number <span className="text-red-500">*</span></label>
                                                        <input
                                                            type="tel"
                                                            value={receiptPhone}
                                                            onChange={e => setReceiptPhone(e.target.value)}
                                                            required
                                                            placeholder="e.g. +60123456789"
                                                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Postal Address <span className="text-red-500">*</span></label>
                                                    <textarea
                                                        value={receiptAddress}
                                                        onChange={e => setReceiptAddress(e.target.value)}
                                                        required
                                                        rows={3}
                                                        placeholder="Your complete postal address for receipt delivery"
                                                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all text-sm resize-none"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={receiptCompany}
                                                        onChange={e => setReceiptCompany(e.target.value)}
                                                        required
                                                        placeholder="e.g. Acme Corporation Sdn Bhd"
                                                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Registration Number <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={receiptRegNo}
                                                        onChange={e => setReceiptRegNo(e.target.value)}
                                                        required
                                                        placeholder="e.g. 202101012345"
                                                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Address <span className="text-red-500">*</span></label>
                                                    <textarea
                                                        value={receiptBizAddress}
                                                        onChange={e => setReceiptBizAddress(e.target.value)}
                                                        required
                                                        rows={3}
                                                        placeholder="Your complete business address for receipt delivery"
                                                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all text-sm resize-none"
                                                    />
                                                </div>
                                                <div className="bg-brand-pale/35 rounded-2xl p-4 border border-brand-pale">
                                                    <p className="text-[10px] font-black uppercase text-brand-navy tracking-wider mb-2">Contact Person (For Verification)</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Name</span>
                                                            <span className="text-xs font-black text-brand-navy">{contactName}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                                                            <span className="text-xs font-black text-brand-navy">{contactEmail}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-brand-navy text-white text-xs font-black py-4 rounded-xl shadow-md hover:bg-brand-orange transition-all uppercase tracking-widest disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Receipt Request'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Default Receipt Info (Only shown if refParam is not present) */}
                {!refParam && (
                    <div className="bg-brand-pale/20 rounded-[2.5rem] p-8 md:p-12 mb-16 border border-brand-pale max-w-2xl mx-auto">
                        <h3 className="text-2xl font-black text-brand-navy mb-4 font-heading">{t('thankyou.next_heading')}</h3>
                        <ul className="text-left space-y-6 text-brand-slate font-medium">
                            <li className="flex items-start gap-4">
                                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                                    <span className="font-black text-brand-cyan text-sm">1</span>
                                </div>
                                <p>{t('thankyou.next_step1')}</p>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                                    <span className="font-black text-brand-cyan text-sm">2</span>
                                </div>
                                <p>{t('thankyou.next_step2')}</p>
                            </li>
                        </ul>
                    </div>
                )}

                {/* Share Section */}
                <div className="mb-20">
                    <h3 className="text-sm font-black text-brand-orange uppercase tracking-[0.2em] mb-8">{t('thankyou.share_tag')}</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-[#1877F2] text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg hover:-translate-y-1"
                        >
                            <Facebook className="h-5 w-5" />
                            {t('thankyou.share_facebook')}
                        </a>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg hover:-translate-y-1"
                        >
                            <WhatsAppIcon className="h-5 w-5" />
                            {t('thankyou.share_whatsapp')}
                        </a>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-3 px-8 py-4 bg-brand-navy text-white rounded-2xl font-bold hover:bg-brand-cyan hover:text-brand-navy transition-all shadow-lg"
                        >
                            {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            {copied ? t('thankyou.share_copied') : t('thankyou.share_copy')}
                        </button>
                    </div>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-3 text-brand-slate font-bold uppercase tracking-widest hover:text-brand-orange transition-colors"
                >
                    {t('thankyou.return_home')} <ArrowRight className="h-5 w-5" />
                </Link>

            </div>
        </div>
    );
};

export default ThankYou;
