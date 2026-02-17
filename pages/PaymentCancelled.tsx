import React from 'react';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentCancelled: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-sans text-brand-slate">
            <div className="max-w-4xl mx-auto px-6 animate-fade-in text-center">

                {/* Cancelled Icon */}
                <div className="h-32 w-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-12 relative">
                    <XCircle className="h-16 w-16 text-red-500" />
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20"></div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-brand-navy mb-8 font-heading tracking-tighter leading-none">
                    Payment Incomplete
                </h1>

                <p className="text-xl md:text-2xl text-brand-slate font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                    Your payment was not completed. No charges have been made to your account. You can try again or choose a different payment method.
                </p>

                {/* Info Card */}
                <div className="bg-brand-pale/20 rounded-[2.5rem] p-8 md:p-12 mb-16 border border-brand-pale max-w-2xl mx-auto">
                    <h3 className="text-2xl font-black text-brand-navy mb-4 font-heading">What happened?</h3>
                    <ul className="text-left space-y-6 text-brand-slate font-medium">
                        <li className="flex items-start gap-4">
                            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                                <span className="font-black text-red-500 text-sm">!</span>
                            </div>
                            <p>The payment may have been cancelled, timed out, or declined by your bank. No money has been deducted.</p>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                                <span className="font-black text-brand-cyan text-sm">✓</span>
                            </div>
                            <p>You can try again immediately or use Manual Bank Transfer as an alternative.</p>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link
                        to="/donate"
                        className="inline-flex items-center justify-center gap-3 bg-brand-orange text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-navy transition-all shadow-xl hover:-translate-y-1"
                    >
                        <RefreshCw className="h-5 w-5" />
                        Try Again
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-3 text-brand-slate font-bold uppercase tracking-widest hover:text-brand-orange transition-colors px-10 py-5"
                    >
                        Return to Home <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default PaymentCancelled;
