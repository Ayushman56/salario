
import React from 'react';
import { IndianRupee, DollarSign, Euro, PoundSterling, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const CurrencyIcon = ({ Icon, className, size = 24 }: { Icon: any, className: string, size?: number }) => (
  <div className={`absolute pointer-events-none opacity-10 animate-pulse ${className}`}>
    <Icon size={size} />
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Dynamic Currency Background */}
      <div className="absolute inset-0 overflow-hidden">
        <CurrencyIcon Icon={IndianRupee} className="top-10 left-10 rotate-12" size={120} />
        <CurrencyIcon Icon={DollarSign} className="top-1/4 right-20 -rotate-12" size={80} />
        <CurrencyIcon Icon={Euro} className="bottom-20 left-1/4 rotate-45" size={100} />
        <CurrencyIcon Icon={PoundSterling} className="bottom-1/3 right-1/4 -rotate-45" size={60} />
        <CurrencyIcon Icon={IndianRupee} className="top-1/2 left-20 rotate-12" size={40} />
        <CurrencyIcon Icon={DollarSign} className="bottom-10 right-10" size={150} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl px-6 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-4 duration-700">
          Enterprise Financial OS
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          SALARIO<span className="text-emerald-500">.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          The intelligent payroll infrastructure designed for high-growth organizations. 
          Real-time analytics, automated compliance, and workforce precision.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <button 
            onClick={onEnter}
            className="group flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            Initialize System
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left animate-in fade-in duration-1000 delay-700">
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
            <Zap className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-white font-black text-lg mb-2">Instant Payroll</h3>
            <p className="text-slate-400 text-sm font-medium">Generate entire workforce cycles in seconds with zero-error automation.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
            <BarChart3 className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-white font-black text-lg mb-2">Live Analytics</h3>
            <p className="text-slate-400 text-sm font-medium">Deep insights into organizational spend, trends, and budget guardrails.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
            <ShieldCheck className="text-emerald-500 mb-4" size={32} />
            <h3 className="text-white font-black text-lg mb-2">Bank-Grade Security</h3>
            <p className="text-slate-400 text-sm font-medium">Encrypted data persistence and strictly enforced administrative access.</p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 right-0 text-center opacity-30">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Global Currency Infrastructure • 2024</p>
      </div>
    </div>
  );
};
