import React from 'react';

const Refund: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 animate-fade-in">
                <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm">Legal & Compliance</div>
                <h1 className="text-4xl md:text-5xl font-black text-brand-navy mb-12 font-heading leading-tight">
                    Refund & <br />
                    <span className="text-brand-cyan">Cancellation Policy.</span>
                </h1>

                <div className="prose prose-lg prose-slate max-w-none text-brand-slate font-medium">
                    <p className="lead text-2xl font-bold text-brand-navy mb-12">
                        Sepeda Amal Borneo 2026 is a charitable initiative organized by the Malaysian Medical Association Foundation (MMAF). All funds raised are directed towards the specific beneficiaries.
                    </p>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">1. Refund of Donations</h3>
                    <p>
                        All donations made to the MMA Foundation for Sepeda Amal Borneo 2026 are <strong>final and non-refundable</strong>.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-cyan">
                        <li>Donations are voluntary and unconditional.</li>
                        <li>In the unlikely event of a duplicate donation or processing error, please contact us immediately with proof of payment. We will review such claims on a case-by-case basis.</li>
                        <li>If a refund is approved due to error, it will be processed within 14 business days, minus any applicable transaction fees charged by third-party payment gateways.</li>
                    </ul>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">2. Registration Fees</h3>
                    <p>
                        Participation fees for riders are collected to cover event logistics (e.g., jerseys, support vehicles, hydration).
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-cyan">
                        <li><strong>Voluntary Cancellation:</strong> Registration fees are non-refundable if a participant withdraws for any reason, including illness or injury.</li>
                        <li><strong>Event Cancellation:</strong> If the event is cancelled by the Organizer due to force majeure (e.g., natural disaster, pandemic restrictions), registration fees may be refunded partially or in full at the Organizer's discretion, after deducting strictly non-recoverable costs.</li>
                    </ul>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">3. Tax Receipts</h3>
                    <p>
                        Once an official tax-exempt receipt has been issued by MMAF, the donation cannot be refunded under any circumstances as per LHDN regulations.
                    </p>

                    <div className="bg-brand-pale/20 p-8 rounded-[2rem] border border-brand-pale mt-12">
                        <h4 className="text-brand-navy font-black text-xl mb-4">Questions?</h4>
                        <p className="mb-4">For any inquiries regarding this policy, please reach out to the MMAF secretariat.</p>
                        <p className="text-brand-orange font-bold">Email: sab2026@mma.org.my</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Refund;
