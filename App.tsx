import React from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
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
            <Route path="/thank-you" element={<ThankYou />} />
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
    </HashRouter>
  );
};

export default App;