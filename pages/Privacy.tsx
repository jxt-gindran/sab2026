import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 animate-fade-in">
                <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm">Legal & Compliance</div>
                <h1 className="text-4xl md:text-5xl font-black text-brand-navy mb-12 font-heading leading-tight">
                    Privacy Policy & <br />
                    <span className="text-brand-cyan">Data Protection (PDPA).</span>
                </h1>

                <div className="prose prose-lg prose-slate max-w-none text-brand-slate font-medium">
                    <p className="lead text-2xl font-bold text-brand-navy mb-12">
                        Sepeda Amal Borneo (SAB), organized under the Malaysian Medical Association Foundation (MMAF), is committed to protecting your personal data in accordance with the Personal Data Protection Act 2010 (PDPA).
                    </p>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">1. Introduction</h3>
                    <p>
                        This Privacy Policy explains how MMAF ("we", "us", "our") collects, uses, and discloses your personal data when you participate in SAB 2026, make a donation, or use our website. By engaging with us, you consent to the processing of your personal data as described herein.
                    </p>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">2. Information We Collect</h3>
                    <p>
                        We collect personal data that is necessary for the administration of the charity ride and the processing of donations. This includes, but is not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-cyan">
                        <li><strong>Identity Data:</strong> Full Name, NRIC/Passport Number (mandatory for tax-exempt receipts).</li>
                        <li><strong>Contact Data:</strong> Email address, phone number, and mailing address.</li>
                        <li><strong>Transaction Data:</strong> Details of donations, payments, and participation fees.</li>
                        <li><strong>Health Data (for Riders):</strong> Medical declarations and emergency contact information, strictly for safety purposes.</li>
                    </ul>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">3. Purpose of Collection</h3>
                    <p>
                        Your data is collected and processed for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-cyan">
                        <li>To process your registration for SAB 2026.</li>
                        <li>To issue official tax-exempt receipts in compliance with the Inland Revenue Board of Malaysia (LHDN) requirements (Ref: LHDN.01/35/42/51/179-6.5621).</li>
                        <li>To communicate with you regarding event updates, safety briefings, and ride logistics.</li>
                        <li>To comply with legal and regulatory obligations.</li>
                    </ul>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">4. Disclosure of Information</h3>
                    <p>
                        We do not sell, trade, or rent your personal data. However, we may disclose your data to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-cyan">
                        <li><strong>LHDN (Inland Revenue Board):</strong> For the purpose of tax exemption reporting.</li>
                        <li><strong>Payment Processors (HitPay):</strong> To facilitate secure payment transactions.</li>
                        <li><strong>Event Partners:</strong> Medical support teams and logistics providers (strictly on a need-to-know basis for safety).</li>
                    </ul>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">5. Data Security</h3>
                    <p>
                        We implement appropriate technical and organizational measures to safeguard your personal data against unauthorized access, loss, or misuse. Our payment gateway uses industry-standard encryption (SSL/TLS) to protect financial information.
                    </p>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">6. Access and Correction</h3>
                    <p>
                        Under the PDPA, you have the right to request access to and correction of your personal data held by us. To make such a request, please contact us at the details below.
                    </p>

                    <div className="bg-brand-pale/20 p-8 rounded-[2rem] border border-brand-pale mt-12">
                        <h4 className="text-brand-navy font-black text-xl mb-4">Contact Us</h4>
                        <p className="mb-2"><strong>Malaysian Medical Association Foundation</strong></p>
                        <p className="mb-2">
                            <a href="https://maps.google.com/?q=MMA+House,+124,+Jalan+Pahang,+53000+Kuala+Lumpur" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                                4th Floor, MMA House, 124, Jalan Pahang,<br />
                                53000 Kuala Lumpur, Malaysia.
                            </a>
                        </p>
                        <p className="text-brand-orange font-bold">Email: <a href="mailto:foundation@mma.org.my" className="underline hover:text-brand-navy">foundation@mma.org.my</a></p>
                        <p className="text-brand-orange font-bold">Phone: <a href="tel:+60340411375" className="underline hover:text-brand-navy">+603-4041 1375</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
