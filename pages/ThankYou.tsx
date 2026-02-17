import React, { useEffect, useState } from 'react';
import {
    Heart,
    Share2,
    Facebook,
    Linkedin,
    CheckCircle2,
    ArrowRight,
    Copy,
    Download
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

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
    const [amount, setAmount] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // HitPay redirects with ?status=completed or ?status=failed/canceled
        const status = searchParams.get('status');
        if (status && status !== 'completed') {
            navigate('/payment-cancelled', { replace: true });
            return;
        }
        const amt = searchParams.get('amount');
        if (amt) setAmount(amt);
    }, [searchParams, navigate]);

    const shareUrl = "https://sab.mma.org.my";
    const shareText = "I just supported the Sepeda Amal Borneo 2026 mission to save lives! Join me in making a difference.";

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-sans text-brand-slate">
            <div className="max-w-4xl mx-auto px-6 animate-fade-in text-center">

                {/* Success Icon */}
                <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-12 relative">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                    <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20"></div>
                </div>

                <h1 className="text-6xl md:text-7xl font-black text-brand-navy mb-8 font-heading tracking-tighter leading-none">
                    Thank You!
                </h1>

                <p className="text-xl md:text-2xl text-brand-slate font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                    Your contribution{amount ? ` of RM ${amount}` : ''} is securely received. You are directly funding life-saving surgeries for children in Borneo.
                </p>

                {/* Receipt Info */}
                <div className="bg-brand-pale/20 rounded-[2.5rem] p-8 md:p-12 mb-16 border border-brand-pale max-w-2xl mx-auto">
                    <h3 className="text-2xl font-black text-brand-navy mb-4 font-heading">What happens next?</h3>
                    <ul className="text-left space-y-6 text-brand-slate font-medium">
                        <li className="flex items-start gap-4">
                            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                                <span className="font-black text-brand-cyan text-sm">1</span>
                            </div>
                            <p>You will receive an official tax-exemption receipt via email within 24 hours.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                                <span className="font-black text-brand-cyan text-sm">2</span>
                            </div>
                            <p>Your donation will be matched to a specific medical case or general fund needs.</p>
                        </li>
                    </ul>
                </div>

                {/* Share Section */}
                <div className="mb-20">
                    <h3 className="text-sm font-black text-brand-orange uppercase tracking-[0.2em] mb-8">Multiply Your Impact</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-[#1877F2] text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg hover:-translate-y-1"
                        >
                            <Facebook className="h-5 w-5" />
                            Share on Facebook
                        </a>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg hover:-translate-y-1"
                        >
                            <WhatsAppIcon className="h-5 w-5" />
                            Share on WhatsApp
                        </a>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-3 px-8 py-4 bg-brand-navy text-white rounded-2xl font-bold hover:bg-brand-cyan hover:text-brand-navy transition-all shadow-lg"
                        >
                            {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-3 text-brand-slate font-bold uppercase tracking-widest hover:text-brand-orange transition-colors"
                >
                    Return to Home <ArrowRight className="h-5 w-5" />
                </Link>

            </div>
        </div>
    );
};

export default ThankYou;
