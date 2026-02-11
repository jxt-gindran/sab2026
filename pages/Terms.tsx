import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6 animate-fade-in">
                <div className="text-brand-orange font-black uppercase tracking-[0.2em] mb-4 text-sm">Legal & Compliance</div>
                <h1 className="text-4xl md:text-5xl font-black text-brand-navy mb-12 font-heading leading-tight">
                    Terms & <br />
                    <span className="text-brand-cyan">Conditions.</span>
                </h1>

                <div className="prose prose-lg prose-slate max-w-none text-brand-slate font-medium">
                    <p className="lead text-2xl font-bold text-brand-navy mb-12">
                        By registering for Sepeda Amal Borneo 2026 (the "Event"), you agree to the following terms and conditions set forth by the Malaysian Medical Association Foundation (MMAF).
                    </p>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">1. Participation & Eligibility</h3>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-cyan">
                        <li>The Event is open to all cyclists aged 18 and above who are medically fit to engage in strenuous physical activity.</li>
                        <li>The Organizer reserves the right to refuse entry or disqualify any participant for safety reasons or failure to meet requirements.</li>
                        <li>Riders must bring their own bicycles and ensure they are in good working condition. Helmet use is mandatory at all times while cycling.</li>
                    </ul>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">2. Fundraising Commitment</h3>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-cyan">
                        <li>Each rider commits to raising a minimum of RM 3,000 in donations for the beneficiaries (MAPS and MyPOPI).</li>
                        <li>The Organizer will provide a fundraising platform and support, but the primary responsibility lies with the participant.</li>
                        <li>Sponsorship funds raised are non-refundable and will be directed fully to the charitable causes.</li>
                    </ul>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">3. Risk & Liability</h3>
                    <p>
                        Participants acknowledge that improving or maintaining health and fitness involves inherent risks. By participating, you agree to assume all risks associated with the Event, including but not limited to falls, contact with other participants, effects of weather, traffic, and road conditions.
                    </p>
                    <p className="mt-4">
                        You hereby release and discharge the MMA Foundation, Sepeda Amal Borneo, its organizers, sponsors, and volunteers from any liability, claims, or damages arising out of your participation.
                    </p>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">4. Media Consent</h3>
                    <p>
                        By participating, you grant the Organizer permission to use your name, photograph, voice, or likeness in any broadcast, telecast, or other promotion of the Event without compensation.
                    </p>

                    <h3 className="text-brand-navy font-black text-2xl mt-12 mb-6 font-heading">5. Cancellation & Amendments</h3>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-cyan">
                        <li>The Organizer reserves the right to modify the route or schedule due to unforeseen circumstances (e.g., extreme weather).</li>
                        <li>If the Event is cancelled by the Organizer, participants will be notified via email and the official website.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Terms;
