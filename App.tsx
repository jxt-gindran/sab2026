import React from 'react';
import { SafeI18nProvider } from './lib/i18n';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Legacy from './pages/Legacy';
import Ride from './pages/Ride';
import Donate from './pages/Donate';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ThankYou from './pages/ThankYou';
import PaymentCancelled from './pages/PaymentCancelled';
import CyclistProfile from './pages/CyclistProfile';
import Media from './pages/Media';

const ScrollToTopAndSEO = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);

    const routesContent: Record<string, { title: string, desc: string }> = {
      '/': { title: 'Sepeda Amal Borneo 2026', desc: 'A 680km charity cycling expedition across Borneo funding life-saving paediatric surgeries.' },
      '/mission': { title: 'Our Mission | SAB 2026', desc: 'Learn about our mission to fund life-saving paediatric care in Sarawak through a 680km cycling expedition.' },
      '/legacy': { title: 'Our Legacy | SAB 2026', desc: 'Building on the success of past editions, our legacy continues as we cycle across Borneo.' },
      '/ride': { title: 'The Ride | SAB 2026', desc: 'Explore the 680km route from Kota Kinabalu to Miri. Meet the dedicated cyclists undertaking the challenge.' },
      '/donate': { title: 'Donate | SAB 2026', desc: 'Support the Sepeda Amal Borneo expedition. Your donation directly funds life-saving paediatric care.' },
      '/contact': { title: 'Contact Us | SAB 2026', desc: 'Get in touch for sponsorships or general questions.' },
      '/faq': { title: 'FAQ | SAB 2026', desc: 'Frequently asked questions about the SAB 2026 Charity Ride.' },
      '/media': { title: 'Media Enquiries | SAB 2026', desc: 'Press releases, media kits, and official statements from the Sepeda Amal Borneo 2026 expedition.' },
      '/terms': { title: 'Terms & Conditions | SAB 2026', desc: 'Terms and conditions for using the SAB 2026 website and donation platform.' },
      '/privacy': { title: 'Privacy Policy | SAB 2026', desc: 'Privacy policy and data protection information for SAB 2026.' },
      '/refund': { title: 'Refund Policy | SAB 2026', desc: 'Refund and cancellation policy for donations made to SAB 2026.' },
      '/thank-you': { title: 'Thank You | SAB 2026', desc: 'Thank you for your generous donation to the Sepeda Amal Borneo 2026 charity ride.' },
      '/payment-cancelled': { title: 'Payment Cancelled | SAB 2026', desc: 'Your payment was not completed. You can try again at any time.' },
    };

    // Handle dynamic /riders/:slug route
    const isRiderPage = pathname.startsWith('/riders/');

    const seo = isRiderPage
      ? { title: 'Cyclist Profile | SAB 2026', desc: 'Meet one of the dedicated cyclists taking on the 680km Sepeda Amal Borneo 2026 challenge for paediatric care.' }
      : (routesContent[pathname] || { title: 'Sepeda Amal Borneo 2026', desc: 'Charity cycling expedition across Borneo.' });
    document.title = seo.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.desc);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <SafeI18nProvider>
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <ScrollToTopAndSEO />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/legacy" element={<Legacy />} />
            <Route path="/ride" element={<Ride />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/media" element={<Media />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            <Route path="/riders/:slug" element={<CyclistProfile />} />
            <Route path="*" element={
              <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center">
                  <h1 className="text-8xl font-black text-brand-navy mb-4 font-heading">404</h1>
                  <p className="text-xl text-brand-slate mb-8">This page doesn't exist.</p>
                  <Link to="/" className="bg-brand-orange text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-brand-cyan hover:text-brand-navy transition-all">Go Home</Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
    </SafeI18nProvider>
  );
};

export default App;