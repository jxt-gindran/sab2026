import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [inputToken, setInputToken] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim()) {
      login(inputToken.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-cyan"></div>
        
        <div className="h-16 w-16 bg-brand-pale rounded-2xl flex items-center justify-center mb-6 text-brand-navy mx-auto">
          <Lock className="h-8 w-8" />
        </div>
        
        <h1 className="text-3xl font-black text-center text-brand-navy mb-2 font-heading tracking-tight">Nadi-SAB</h1>
        <p className="text-center text-brand-slate font-medium mb-8">Admin Control Panel</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Passcode</label>
            <input
              type="password"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Enter secure passcode"
              className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl px-6 py-4 font-bold text-brand-navy focus:border-brand-cyan outline-none transition-all"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-brand-cyan text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-brand-navy shadow-lg"
          >
            Authenticate <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        {isAuthenticated === false && inputToken.length > 0 && (
          <p className="text-center text-red-500 font-bold text-xs mt-6">Invalid passcode.</p>
        )}
      </div>
    </div>
  );
}
