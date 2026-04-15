import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Globe,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';

// ── All English keys/values (sourced from lib/i18n/en.ts) ───────────────────
// Keep in sync with the root lib/i18n/en.ts file.
const EN_FLAT: Record<string, string> = {
  'navbar.home': 'Home',
  'navbar.mission': 'The Mission',
  'navbar.legacy': 'Our Legacy',
  'navbar.ride': 'The Ride',
  'navbar.language': 'Language',
  'navbar.register': 'Register to Ride',
  'navbar.registration_full': 'Registration Full',
  'navbar.donate': 'DONATE',
  'navbar.donate_now': 'DONATE NOW',
  'footer.tagline': 'Trusted Authority. Vibrant Hope.',
  'footer.description': 'Sepeda Amal Borneo 2026 (SAB2026) is a premier 660KM charity cycling event across Borneo, from Kota Kinabalu (Sabah) to Miri (Sarawak). Organized by the Malaysian Medical Association Foundation (MMAF) to fund life-saving paediatric surgeries and support children with Primary Immunodeficiencies (PID).',
  'footer.quick_links': 'Quick Links',
  'footer.link_mission': 'The Mission',
  'footer.link_ride': 'The Ride',
  'footer.link_sponsorships': 'Sponsorships',
  'footer.link_faq': 'FAQ',
  'footer.link_contact': 'Contact Us',
  'footer.legal_trust': 'Legal & Trust',
  'footer.link_privacy': 'Privacy Policy',
  'footer.link_terms': 'Terms & Conditions',
  'footer.link_refund': 'Refund Policy',
  'footer.tax_exempt': 'Tax Exempt: LHDN.01/35/42/51/179-6.5621',
  'footer.mmaf_reg': 'MMAF Reg: PPM-001-14-14022019',
  'footer.connect': 'Connect',
  'footer.social_tagline': 'Every pedal stroke brings hope to a child in need. Join the movement.',
  'footer.copyright': '© 2026 Sepeda Amal Borneo. Organized by MMA Foundation.',
  'footer.powered_by': 'Powered by Cyclists',
  'footer.system_operational': 'System Operational',
  'home.hero_title_line1': 'Pedal for Care,',
  'home.hero_title_line2': 'Ride for Hope.',
  'home.hero_subtitle': "Funding life-saving surgeries and immune defense for Malaysia's most vulnerable children. Powered by a 660km endurance ride across Borneo.",
  'home.hero_save_life': 'Save a Life Now',
  'home.hero_highlights': 'Past Highlights',
  'home.hero_close': 'Close',
  'home.hero_org': 'Organized by Malaysian Medical Association | Tax Exempt',
  'home.video_unsupported': 'Your browser does not support the video tag.',
  'home.stats_raised_label': 'Raised',
  'home.stats_cycled_label': 'Cycled',
  'home.stats_cycled_value': '3,900 KM',
  'home.stats_tax_label': 'Tax Relief',
  'home.stats_tax_value': '100%',
  'home.stats_charities_label': 'Charities',
  'home.stats_charities_value': '5',
  'home.stats_charities_suffix': 'Beneficiary',
  'home.fundraising_label': 'Fundraising Progress',
  'home.fundraising_heading_prefix': 'Together, We Ride Towards',
  'home.fundraising_raised_label': 'Raised so far',
  'home.fundraising_goal_label': 'Goal',
  'home.fundraising_funded_suffix': '% Funded',
  'home.fundraising_donate': 'Donate Now',
  'home.patient_tag': 'Real Lives. Real Impact.',
  'home.patient_name': 'Meet Adik Rizky.',
  'home.patient_age_label': 'Years Old',
  'home.patient_quote': '"Born with a congenital heart defect, Rizky needed urgent surgery his family couldn\'t afford. Thanks to funds raised by our cyclists for MAPS, he received his life-saving operation in 2024. Today, he is back in school and playing football."',
  'home.patient_cta': 'Donate to help more kids like Rizky',
  'home.mission_tag': 'Our Core Mission 2026',
  'home.mission_heading1': 'Two Causes.',
  'home.mission_heading2': 'One Lifeline.',
  'home.mission_desc': 'Sepeda Amal Borneo is more than a cycling event; it is a movement. We ride to turn awareness into action, ensuring that no child is denied medical care due to lack of funds.',
  'home.maps_name': 'MAPS Malaysia',
  'home.maps_tagline': 'Repairing Little Lives',
  'home.maps_desc': 'Funding complex paediatric surgeries for congenital anomalies and life-threatening conditions.',
  'home.maps_see_how': 'See How We Help',
  'home.maps_donate': 'Donate Now →',
  'home.mypopi_name': 'MyPOPI',
  'home.mypopi_tagline': 'Defending the Defenseless',
  'home.mypopi_desc': 'Supporting diagnostics and treatment for Primary Immunodeficiency (PID) patients.',
  'home.mypopi_see_how': 'See How We Help',
  'home.mypopi_donate': 'Donate Now →',
  'home.history_heading': 'A History of Moving Mountains.',
  'home.history_subheading': 'Consistent impact, year after year.',
  'home.ride_tag': 'The Challenge',
  'home.ride_heading': 'Kota Kinabalu to Miri.',
  'home.ride_km': '680 KM',
  'home.ride_desc': 'A high-endurance cross-country expedition across the rugged heart of Borneo.',
  'home.champions_heading': 'Meet the Champions.',
  'home.champions_subheading': "Endurance mirrors the patient's journey.",
  'home.champions_view_all': 'View All Riders',
  'home.rider_raised': 'Raised:',
  'home.rider_goal': 'Goal:',
  'home.rider_view_profile': 'View Profile',
  'home.no_cyclists_heading': 'Cyclists Registration Ongoing',
  'home.no_cyclists_desc': 'We are currently vetting and onboarding our elite riders for SAB 2026. Check back soon to see their profiles.',
  'home.cta_heading': 'Ready to Make an Impact?',
  'home.cta_donate': 'Donate to General Fund',
  'home.cta_register': 'Register as a Cyclist',
  'home.partners_heading': 'Our Partners in Hope',
  'home.partners_corporate': 'Become a Corporate Partner →',
  'mission.tag': 'The Cause',
  'mission.heading1': 'Two Causes.',
  'mission.heading2': 'One Lifeline.',
  'mission.subtitle': "We ride to bridge the gap between life and death for Malaysia's children. Every kilometer cycled funds a surgery or a diagnosis that otherwise wouldn't happen.",
  'mission.about_heading': 'Who We Are.',
  'mission.about_desc': 'Sepeda Amal Borneo (SAB) is a charity cycling group dedicated to supporting NGOs and high-impact community projects. Founded in 2022, we turn awareness into action by raising vital funds and standing in solidarity with those in need; most recently through our collaboration with the Malaysian Medical Association (MMA) to champion healthcare initiatives across the region.',
  'mission.maps_heading': 'Malaysian Association of Paediatric Surgery',
  'mission.maps_tagline': 'Restoring Futures, One Child at a Time',
  'mission.maps_desc': "Children born with congenital conditions don't just need care—they need timely, specialised surgery to survive and thrive. MAPS strengthens paediatric surgical services across Malaysia through training, system development, and strategic collaboration, ensuring that every child benefits from timely, coordinated, and seamless surgical care—no matter where they are.",
  'mission.maps_bullet1': 'Advancing excellence in paediatric surgical care.',
  'mission.maps_bullet2': 'Bridging gaps in access across urban and rural communities.',
  'mission.maps_bullet3': 'Strengthening capacity through training and essential equipment.',
  'mission.maps_bullet4': 'Driving collaboration to ensure seamless, end-to-end surgical care.',
  'mission.maps_visit': 'Visit Official Website',
  'mission.mypopi_heading': 'MyPOPI (Immune Deficiency)',
  'mission.mypopi_tagline': 'Defending the Defenseless',
  'mission.mypopi_desc': 'Supporting "bubble babies" born with severely weakened immune systems, where every moment matters.',
  'mission.mypopi_bullet1': 'Saving lives through early detection to prevent severe and often fatal infections',
  'mission.mypopi_bullet2': 'Providing financial relief to families facing the overwhelming cost of long-term treatment and care',
  'mission.mypopi_bullet3': 'Helping families afford vital genetic diagnostic testing when it matters most',
  'mission.mypopi_bullet4': 'Giving SCID patients a second chance at life through critical bone marrow treatment',
  'mission.mypopi_visit': 'Visit Official Website',
  'mission.stories_heading1': 'Real Lives.',
  'mission.stories_heading2': 'Real Impact.',
  'mission.stories_quote': '"Thanks to the surgery funded by SAB, I can play football again."',
  'mission.stories_name': 'Adik Rizky, 7',
  'mission.stories_role': 'Congenital Heart Defect Survivor',
  'mission.cta_heading': 'These children cannot fight alone.',
  'mission.cta_btn': 'Donate to the Mission',
  'ride.event_date': '26 July - 1 August 2026',
  'ride.hero_heading1': 'The',
  'ride.hero_heading2': 'Ride.',
  'ride.hero_location': 'Kota Kinabalu to Miri',
  'ride.stat_days_label': 'Days',
  'ride.stat_days_value': '6',
  'ride.stat_distance_label': 'Distance',
  'ride.stat_distance_value': '680 KM',
  'ride.stat_territories_label': 'Territories',
  'ride.stat_territories_value': '4',
  'ride.stat_cyclists_label': 'Cyclists',
  'ride.stat_cyclists_value': '20',
  'ride.quote': '"Endurance cycling mirrors the realities faced by patients: long journeys marked by uncertainty, setbacks, and the need for sustained support."',
  'ride.support_heading': 'Support a Rider.',
  'ride.support_subheading': 'Sponsor a champion and help them reach their fundraising goal.',
  'ride.rider_raised': 'Raised:',
  'ride.rider_goal': 'Goal:',
  'ride.rider_view_profile': 'View Profile',
  'ride.no_roster_heading': 'The Roster is Forming.',
  'ride.no_roster_desc': 'We are actively selecting the riders who will take on the 680km challenge across Borneo. Stay tuned as we announce our champions soon.',
  'ride.cta_heading': 'Join the Peloton.',
  'ride.cta_desc': 'Ready to push your limits for a cause?',
  'ride.cta_min_donation': 'Minimum Donation to Ride: RM 3,000',
  'ride.cta_register': 'Register to Ride',
  'ride.cta_disclaimer': 'Limited slots available. Riders are selected based on fundraising commitment and fitness readiness.',
  'legacy.tag': 'Track Record',
  'legacy.heading1': 'A History of',
  'legacy.heading2': 'Moving Mountains.',
  'legacy.raised_prefix': 'Over',
  'legacy.raised_amount': 'RM 1.2 Million',
  'legacy.raised_suffix': 'raised since 2022.',
  'legacy.cycling_desc': 'Cycling is both symbolic and practical in our work. It is a form of movement that speaks directly to health, resilience, and prevention; values that sit at the heart of many community and healthcare causes. Endurance cycling mirrors the realities faced by patients and families: long journeys marked by uncertainty, setbacks, and the need for sustained support to keep going. At the same time, cycling takes these important conversations out of institutions and into everyday spaces; beyond hospitals and clinics, bringing visibility to health challenges across towns, rural communities, and daily life. Through cycling, we turn awareness into action, movement into meaning - moving together, visibly and purposefully, for those who cannot.',
  'legacy.cycling_desc_mobile': 'Cycling is symbolic and practical, speaking directly to health and resilience. It mirrors the long journeys faced by patients. Through cycling, we take these conversations into everyday spaces, turning awareness into action for those who cannot.',
  'legacy.mma_name': 'Malaysian Medical Association',
  'legacy.mma_desc': 'Established 1959. 17,000 members committed to medical ethics and public health.',
  'legacy.mmaf_name': 'MMA Foundation',
  'legacy.mmaf_desc': 'Established 1974. Managing charitable donations with absolute transparency and accountability.',
  'legacy.funds_raised_label': 'Funds Raised',
  'legacy.read_more': 'Read More',
  'legacy.current_badge': 'Current',
  'legacy.cta_desc': 'Be part of history.',
  'legacy.cta_btn': 'Make your mark',
  'legacy.modal_close': 'Close',
  'faq.tag': 'Common Questions',
  'faq.heading1': 'Frequently Asked',
  'faq.heading2': 'Questions.',
  'faq.donors_heading': 'For Donors',
  'faq.cyclists_heading': 'For Cyclists',
  'faq.q1': 'Are donations tax-exempt?',
  'faq.a1': 'Yes. All cash donations of RM 50 and above made to MMAF are tax-exempted under subsection 44(6) of the Income Tax Act 1967.',
  'faq.q2': 'How will my donation be used?',
  'faq.a2': 'Funds raised are directed to MAPS (paediatric surgeries) and MyPOPI (immune deficiency diagnostics and treatment).',
  'faq.q3': 'Can I donate offline or via cheque?',
  'faq.a3': 'Yes. Please contact the MMA Foundation directly at +603-4041 1375 or email sab2026@mma.org.my.',
  'faq.q4': 'Will I receive a receipt?',
  'faq.a4': 'Yes. An official tax-exempt receipt will be issued by MMAF once your donation is verified.',
  'faq.q5': 'Does the money go to the rider?',
  'faq.a5': 'No. 100% of your donation goes directly to the MMA Foundation for the beneficiaries.',
  'faq.q6': 'What is the fundraising requirement?',
  'faq.a6': 'Each rider must commit to raising a minimum of RM 3,000.',
  'faq.q7': 'What is the route and distance?',
  'faq.a7': 'The ride covers approximately 660km from Kota Kinabalu to Miri over 6 days.',
  'faq.q8': 'Is support provided during the ride?',
  'faq.a8': 'Yes. The ride is fully supported with marshal escorts, support vehicles, medical teams, and mechanical assistance.',
  'faq.q9': 'Do I need to be an expert cyclist?',
  'faq.a9': 'You should be fit and capable of riding 100km+ per day for consecutive days.',
  'donate.how_step1_title': 'Select a Cause',
  'donate.how_step1_desc': 'General Fund or a specific Rider.',
  'donate.how_step2_title': '100% Secure',
  'donate.how_step2_desc': 'Direct to MMA Foundation (Tax Exempt).',
  'donate.how_step3_title': 'Get Receipt',
  'donate.how_step3_desc': 'LHDN-compliant tax receipt instantly.',
  'donate.step_indicator': 'Step 1 of 4',
  'donate.back': 'Back',
  'donate.continue': 'Continue',
  'donate.complete': 'Complete Donation',
  'donate.step1_heading': 'Choose Your Impact.',
  'donate.step1_sub': 'Select an amount or enter your own. Every ringgit counts towards a life-saving surgery.',
  'donate.step1_other': 'Other Amount',
  'donate.step1_supporting': 'Supporting:',
  'donate.step1_general': 'General Fund (SAB2026)',
  'donate.tier1_label': 'Care Bundle',
  'donate.tier1_desc': 'Essential hygiene kits for recovery.',
  'donate.tier2_label': 'Immune Support',
  'donate.tier2_desc': 'Diagnostic tests for deficiency.',
  'donate.tier3_label': 'Surgery Fund',
  'donate.tier3_desc': 'O.T. consumables for one child.',
  'donate.tier4_label': 'Full Hero',
  'donate.tier4_desc': 'Complete surgery + post-op care.',
  'donate.step2_heading': "Who's building hope?",
  'donate.step2_sub': 'We need your details for the official tax receipt (LHDN).',
  'donate.step2_beneficiary': 'Beneficiary',
  'donate.step2_name_label': 'Full Name (as per IC)',
  'donate.step2_name_placeholder': 'e.g. Ahmad bin Ali',
  'donate.step2_email_label': 'Email Address',
  'donate.step2_email_placeholder': 'ahmad@example.com',
  'donate.step2_phone_label': 'Phone Number',
  'donate.step2_phone_placeholder': '+60 12 345 6789',
  'donate.step2_ic_label': 'IC / Passport Number',
  'donate.step2_ic_optional': '(optional, for tax receipt)',
  'donate.step2_ic_placeholder': 'Optional — for Tax Exemption Receipt',
  'donate.step2_privacy': 'Your data is encrypted and handled according to PDPA 2010.',
  'donate.val_required': 'Name, Email, and Phone Number are mandatory.',
  'donate.val_email': 'Please enter a valid email address.',
  'donate.val_phone': 'Please enter a valid phone number (e.g. +60123456789).',
  'donate.val_ic': 'Please enter a valid IC / Passport Number (at least 6 characters).',
  'donate.step3_heading': 'The Final Step.',
  'donate.step3_sub': 'Select your preferred payment method via our secure HitPay gateway.',
  'donate.step3_hitpay_name': 'HitPay Checkout',
  'donate.step3_hitpay_sub': 'FPX, Cards, GrabPay, ShopeePay',
  'donate.step3_transfer_name': 'Manual Bank Transfer',
  'donate.step3_transfer_sub': 'UOB Direct (WhatsApp / Email Proof)',
  'donate.step3_processed_by': 'Securely processed by',
  'donate.step4_hitpay_heading': 'Ready to Redirect.',
  'donate.step4_hitpay_sub': 'Click below to proceed to the secure HitPay gateway and complete your donation of',
  'donate.step4_proceed': 'Proceed to Checkout',
  'donate.step4_transfer_heading': 'Heart of Gold.',
  'donate.step4_transfer_sub': 'Please complete your manual transfer to the MMA Foundation account below.',
  'donate.step4_warning': 'IMPORTANT: Please put "SAB2026" as your recipient reference for automated verification.',
  'donate.step4_bank_name_label': 'Bank Name',
  'donate.step4_bank_name_value': 'UOB Malaysia',
  'donate.step4_holder_label': 'Account Holder',
  'donate.step4_holder_value': 'MMA Foundation',
  'donate.step4_account_label': 'Account Number',
  'donate.step4_whatsapp': 'Send Receipt via WhatsApp',
  'donate.step4_upload': 'Click to Upload Receipt (Email)',
  'donate.step4_upload_hint': 'PDF, JPG, or PNG (Max 5MB)',
  'donate.step4_hitpay_tab': 'HitPay',
  'donate.step4_transfer_tab': 'Manual Transfer',
  'donate.err_init': 'Payment initialization failed. Please try again.',
  'donate.err_server': 'Error connecting to payment server. Please try again.',
  'donate.err_receipt_recorded': 'Thank you! Your donation of RM {amount} has been recorded.',
  'donate.err_receipt_email': "Please email your receipt to sab2026@mma.org.my with subject 'SAB2026 Manual Receipt' for verification.",
  'donate.sidebar_summary': 'Current Summary',
  'donate.sidebar_donation': 'Donation',
  'donate.sidebar_sponsoring': 'Supporting',
  'donate.sidebar_general': 'General Medical Fund',
  'donate.sidebar_tax_label': 'Tax Exempt',
  'donate.sidebar_tax_desc': 'All donations to MMA Foundation are tax deductible under Section 44(6) of ITA 1967.',
  'donate.testimonial_name': 'Dr. Kevin Tan',
  'donate.testimonial_role': 'Head of Paediatrics',
  'donate.testimonial_quote': '"Your donation isn\'t just a transaction. It\'s the medicine, the recovery, and the future of a child."',
  'contact.tag': 'Contact Us',
  'contact.heading1': "We're Here to",
  'contact.heading2': 'Help & Serve.',
  'contact.subtitle': "Whether you're a donor, a cyclist, or a supporter, we'd love to hear from you.",
  'contact.get_in_touch': 'Get in Touch.',
  'contact.hq_label': 'Our Headquarters',
  'contact.call_label': 'Call Us',
  'contact.call_hours': 'Mon-Fri, 9am - 5pm',
  'contact.email_label': 'Email Us',
  'contact.social_label': 'Follow Our Journey',
  'contact.corporate_heading': 'Corporate Partnerships.',
  'contact.corporate_desc': 'Align your brand with health and hope. Contact us for Platinum, Gold, and Silver partnership tiers.',
  'contact.corporate_cta': 'Request Sponsor Deck',
  'thankyou.heading': 'Thank You!',
  'thankyou.subtitle_prefix': 'Your contribution',
  'thankyou.subtitle_amount_prefix': 'of RM',
  'thankyou.subtitle_suffix': 'is securely received. You are directly funding life-saving surgeries for children in Borneo.',
  'thankyou.next_heading': 'What happens next?',
  'thankyou.next_step1': 'You will receive an official tax-exemption receipt via email within 24 hours.',
  'thankyou.next_step2': 'Your donation will be matched to a specific medical case or general fund needs.',
  'thankyou.share_tag': 'Multiply Your Impact',
  'thankyou.share_facebook': 'Share on Facebook',
  'thankyou.share_whatsapp': 'Share on WhatsApp',
  'thankyou.share_copy': 'Copy Link',
  'thankyou.share_copied': 'Copied!',
  'thankyou.return_home': 'Return to Home',
  'thankyou.share_text': 'I just supported the Sepeda Amal Borneo 2026 mission to save lives! Join me in making a difference.',
  'cancelled.heading': 'Payment Incomplete',
  'cancelled.subtitle': 'Your payment was not completed. No charges have been made to your account.',
  'cancelled.what_happened': 'What happened?',
  'cancelled.reason1': 'The payment may have been cancelled, timed out, or declined by your bank. No money has been deducted.',
  'cancelled.reason2': 'You can try again immediately or use Manual Bank Transfer as an alternative.',
  'cancelled.try_again': 'Try Again',
  'cancelled.return_home': 'Return to Home',
  'modal.title_open': 'Join the Movement.',
  'modal.title_full': 'Registration Closed.',
  'modal.subtitle_open': 'Become an SAB 2026 Champion',
  'modal.subtitle_full': 'All Cyclist Slots Are Filled',
  'modal.full_interest': 'Thank you for your interest in SAB 2026.',
  'modal.full_desc': "All cyclist slots have been filled for this year's event. Stay tuned for future announcements.",
  'modal.full_support_btn': 'Support a Cyclist Instead',
  'modal.full_close_btn': 'Close',
  'modal.step1_title': 'Official Registration',
  'modal.step1_desc': 'Fill out the official MMA SAB 2026 participation form.',
  'modal.step2_title': 'Health & Safety',
  'modal.step2_desc': 'Provide medical clearance and endurance experience for the 680km ride.',
  'modal.step3_title': 'Fundraising Page',
  'modal.step3_desc': 'Once verified, we will create your custom Champion profile on this site.',
  'modal.commitment': 'Minimum fundraising commitment: RM 3,000. Subject to medical review.',
  'modal.open_form': 'Open Registration Form',
  'modal.coming_soon': 'Registration form coming soon. Stay tuned!',
  'modal.close': 'Close',
  'riderstory.cycling_quote': '"Cycling 660km is nothing compared to the fight these children face every day."',
  'riderstory.progress_label': 'Impact Progress',
  'riderstory.goal_label': 'Goal',
  'riderstory.connect_label': 'Connect:',
  'legal.tag': 'Legal & Compliance',
  'legal.privacy_heading1': 'Privacy Policy &',
  'legal.privacy_heading2': 'Data Protection (PDPA).',
  'legal.refund_heading1': 'Refund &',
  'legal.refund_heading2': 'Cancellation Policy.',
  'legal.terms_heading1': 'Terms &',
  'legal.terms_heading2': 'Conditions.',
  'legal.contact_card_heading': 'Contact Us',
  'legal.questions_heading': 'Questions?',
  'app.not_found': "This page doesn't exist.",
  'app.go_home': 'Go Home',
  'app.verifying': 'Verifying access...',
};

const ALL_KEYS = Object.keys(EN_FLAT).sort();


// ── Language display names ─────────────────────────────────────────────────────
const LANG_NAMES: Record<string, string> = {
  ms: 'Bahasa Malaysia',
  zh: 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  ar: 'Arabic',
  ta: 'Tamil',
};

const getLangName = (code: string) => LANG_NAMES[code] || code.toUpperCase();

// ── Component ─────────────────────────────────────────────────────────────────
export default function Translations() {
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [newLangInput, setNewLangInput] = useState('');
  const [showAddLang, setShowAddLang] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'translated' | 'untranslated'>('all');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  // Convex
  const dbLanguages = useQuery(api.translations.listLanguages) || [];
  const translations = useQuery(
    api.translations.getByLang,
    selectedLang ? { lang: selectedLang } : 'skip'
  ) || [];

  const upsertKey = useMutation(api.translations.upsertKey);
  const deleteKey = useMutation(api.translations.deleteKey);
  const deleteLang = useMutation(api.translations.deleteLanguage);

  // Build a map: key → translated value for the selected language
  const translationMap = useMemo(() => {
    const map: Record<string, string> = {};
    translations.forEach((row: { key: string; value: string }) => {
      map[row.key] = row.value;
    });
    return map;
  }, [translations]);

  // Local edits buffer
  const [edits, setEdits] = useState<Record<string, string>>({});

  // Filtered keys
  const visibleKeys = useMemo(() => {
    let keys = ALL_KEYS;
    if (search) {
      const q = search.toLowerCase();
      keys = keys.filter(k => k.toLowerCase().includes(q) || EN_FLAT[k].toLowerCase().includes(q));
    }
    if (filter === 'translated') {
      keys = keys.filter(k => translationMap[k] || edits[k]);
    } else if (filter === 'untranslated') {
      keys = keys.filter(k => !translationMap[k] && !edits[k]);
    }
    return keys;
  }, [search, filter, translationMap, edits]);

  const translatedCount = ALL_KEYS.filter(k => translationMap[k]).length;
  const pct = Math.round((translatedCount / ALL_KEYS.length) * 100);

  // Get current value for a key (edit buffer → DB → empty)
  const getValue = (key: string) =>
    edits[key] !== undefined ? edits[key] : (translationMap[key] || '');

  const handleChange = (key: string, val: string) => {
    setEdits(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = useCallback(async (key: string) => {
    const value = getValue(key).trim();
    setSavingKey(key);
    try {
      if (value) {
        await upsertKey({ lang: selectedLang, key, value });
      } else {
        await deleteKey({ lang: selectedLang, key });
      }
      setEdits(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    } finally {
      setSavingKey(null);
    }
  }, [selectedLang, edits, upsertKey, deleteKey]);

  const handleAddLang = () => {
    const code = newLangInput.trim().toLowerCase();
    if (!code || dbLanguages.includes(code)) return;
    setSelectedLang(code);
    setNewLangInput('');
    setShowAddLang(false);
    setEdits({});
  };

  const handleDeleteLang = async () => {
    if (!selectedLang) return;
    if (!confirm(`Delete all translations for "${selectedLang}"? This cannot be undone.`)) return;
    await deleteLang({ lang: selectedLang });
    setSelectedLang('');
    setEdits({});
  };

  const pendingEdits = Object.keys(edits).filter(k => edits[k] !== (translationMap[k] || ''));

  const saveAll = async () => {
    for (const key of pendingEdits) {
      await handleSave(key);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black font-heading text-brand-navy flex items-center gap-3">
            <Globe className="h-8 w-8 text-brand-cyan" />
            Translations
          </h1>
          <p className="text-brand-slate mt-2">
            Manage multi-language UI strings. English is always the fallback and never stored here.
          </p>
        </div>
        {pendingEdits.length > 0 && (
          <button
            onClick={saveAll}
            className="flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-brand-navy transition-all shadow-lg"
          >
            <Save className="h-4 w-4" />
            Save All ({pendingEdits.length})
          </button>
        )}
      </div>

      {/* Language Selector Row */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 flex flex-wrap gap-4 items-center">
        <span className="text-sm font-black text-brand-navy uppercase tracking-widest">Language:</span>

        <div className="flex flex-wrap gap-2">
          {dbLanguages.map((lang: string) => (
            <button
              key={lang}
              onClick={() => { setSelectedLang(lang); setEdits({}); }}
              className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${
                selectedLang === lang
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-brand-navy border-brand-pale hover:border-brand-cyan'
              }`}
            >
              {lang.toUpperCase()}
              {selectedLang === lang && <span className="ml-2 opacity-60 text-xs">{getLangName(lang)}</span>}
            </button>
          ))}

          {/* Add Language */}
          {showAddLang ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={newLangInput}
                onChange={e => setNewLangInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddLang()}
                placeholder="e.g. ms, zh"
                className="border-2 border-brand-cyan px-3 py-2 rounded-xl text-sm font-bold w-28 outline-none"
              />
              <button
                onClick={handleAddLang}
                className="bg-brand-cyan text-brand-navy px-3 py-2 rounded-xl text-sm font-black hover:bg-brand-navy hover:text-white transition-all"
              >
                Add
              </button>
              <button
                onClick={() => { setShowAddLang(false); setNewLangInput(''); }}
                className="text-slate-400 hover:text-brand-navy px-2 py-2 text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddLang(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-black border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand-cyan hover:text-brand-cyan transition-all"
            >
              <Plus className="h-4 w-4" /> Add Language
            </button>
          )}
        </div>

        {selectedLang && (
          <button
            onClick={handleDeleteLang}
            className="ml-auto flex items-center gap-1 text-xs font-black text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Delete {selectedLang.toUpperCase()}
          </button>
        )}
      </div>

      {/* Only show table when a language is selected */}
      {!selectedLang ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <Globe className="h-16 w-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-lg">Select or add a language to begin translating.</p>
          <p className="text-slate-300 text-sm mt-2">English strings are shown as reference. Fill in translations on the right.</p>
        </div>
      ) : (
        <>
          {/* Stats + filters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
            <div className="flex flex-wrap gap-6 items-center">
              {/* Progress */}
              <div className="flex-grow min-w-[200px]">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  <span>Translation Progress</span>
                  <span className={pct === 100 ? 'text-green-500' : 'text-brand-orange'}>{pct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-400' : 'bg-brand-orange'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1">{translatedCount} / {ALL_KEYS.length} keys translated</div>
              </div>

              {/* Search */}
              <div className="relative flex-grow max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search keys or English text..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-brand-cyan"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                {(['all', 'translated', 'untranslated'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      filter === f ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Translation Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_auto] text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-6 py-3 border-b border-slate-100">
              <span>Key / English</span>
              <span>{selectedLang.toUpperCase()} Translation</span>
              <span></span>
            </div>

            <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
              {visibleKeys.length === 0 && (
                <div className="py-12 text-center text-slate-400 font-bold">No keys match your search.</div>
              )}
              {visibleKeys.map(key => {
                const enValue = EN_FLAT[key];
                const currentValue = getValue(key);
                const dbValue = translationMap[key] || '';
                const isDirty = edits[key] !== undefined && edits[key] !== dbValue;
                const isTranslated = !!dbValue;
                const isSaving = savingKey === key;
                const isSaved = savedKey === key;

                return (
                  <div
                    key={key}
                    className={`grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-4 items-start hover:bg-slate-50/50 transition-colors ${
                      isDirty ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    {/* Key + English value */}
                    <div className="min-w-0">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 font-mono">{key}</div>
                      <div className="text-sm text-brand-slate leading-relaxed line-clamp-3">{enValue}</div>
                    </div>

                    {/* Translation input */}
                    <div className="relative">
                      <textarea
                        value={currentValue}
                        onChange={e => handleChange(key, e.target.value)}
                        onBlur={() => isDirty && handleSave(key)}
                        rows={Math.min(3, Math.ceil(enValue.length / 60))}
                        placeholder={`Translate to ${getLangName(selectedLang)}…`}
                        className={`w-full px-3 py-2 border-2 rounded-xl text-sm font-medium resize-none outline-none transition-all ${
                          isDirty
                            ? 'border-brand-orange focus:border-brand-orange'
                            : isTranslated
                            ? 'border-green-200 focus:border-brand-cyan'
                            : 'border-slate-200 focus:border-brand-cyan'
                        }`}
                      />
                    </div>

                    {/* Status icon */}
                    <div className="flex items-center pt-2 w-8">
                      {isSaving ? (
                        <div className="h-5 w-5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                      ) : isSaved ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : isDirty ? (
                        <button onClick={() => handleSave(key)}>
                          <Save className="h-5 w-5 text-brand-orange hover:text-brand-navy transition-colors" />
                        </button>
                      ) : isTranslated ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-slate-200" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4 font-bold">
            Changes are saved instantly when you leave a field, or click the save icon. The public site reflects changes immediately.
          </p>
        </>
      )}
    </div>
  );
}
