import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Bike, Heart } from 'lucide-react';

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

const FAQ: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 animate-fade-in">

                <div className="text-center mb-16">
                    <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm">Common Questions</div>
                    <h1 className="text-4xl md:text-5xl font-black text-brand-navy mb-6 font-heading">
                        Frequently Asked <br />
                        <span className="text-brand-cyan">Questions.</span>
                    </h1>
                </div>

                {/* Section 1: Donors */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-brand-orange p-3 rounded-2xl text-white shadow-lg shadow-brand-orange/30">
                            <Heart className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-black text-brand-navy font-heading">For Donors</h2>
                    </div>
                    <div className="space-y-2">
                        <FAQItem
                            question="Are donations tax-exempt?"
                            answer="Yes. All cash donations of RM 50 and above made to the Malaysian Medical Association Foundation (MMAF) are tax-exempted under subsection 44(6) of the Income Tax Act 1967. Reference: LHDN.01/35/42/51/179-6.5621."
                        />
                        <FAQItem
                            question="How will my donation be used?"
                            answer="Funds raised are directed to our two main beneficiaries: MAPS (for paediatric surgeries) and MyPOPI (for immune deficiency diagnostics and treatment). Your contribution directly saves lives."
                        />
                        <FAQItem
                            question="Can I donate offline or via cheque?"
                            answer="Yes. Please contact the MMA Foundation directly at +603-4041 1375 or email foundation@mma.org.my for bank transfer details or cheque instructions."
                        />
                        <FAQItem
                            question="Will I receive a receipt?"
                            answer="Yes. An official tax-exempt receipt will be issued by MMAF and emailed/posted to you once your donation is verified."
                        />
                        <FAQItem
                            question="Does the money go to the rider?"
                            answer="No. 100% of your donation goes directly to the MMA Foundation for the beneficiaries. Selecting a rider simply helps them reach their personal fundraising goal and motivates them on their 660km journey."
                        />
                    </div>
                </div>

                {/* Section 2: Cyclists */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-brand-cyan p-3 rounded-2xl text-brand-navy shadow-lg shadow-brand-cyan/30">
                            <Bike className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-black text-brand-navy font-heading">For Cyclists</h2>
                    </div>
                    <div className="space-y-2">
                        <FAQItem
                            question="What is the fundraising requirement?"
                            answer="Each rider must commit to raising a minimum of RM 3,000. This ensures that the event maximizes its impact for the beneficiaries."
                        />
                        <FAQItem
                            question="What is the route and distance?"
                            answer="The ride covers approximately 660km from Kota Kinabalu to Miri over 6 days. It includes a mix of coastal roads and rolling hills."
                        />
                        <FAQItem
                            question="Is support provided during the ride?"
                            answer="Yes. The ride is fully supported with marshal escorts, support vehicles (SAG wagons), medical teams, and mechanical assistance. Accommodation and meals are also arranged."
                        />
                        <FAQItem
                            question="Do I need to be an expert cyclist?"
                            answer="You should be fit and capable of riding 100km+ per day for consecutive days. We recommend a structured training plan leading up to the event."
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FAQ;
