
import React, { useState } from 'react';
import { Building, Save, Percent, IndianRupee, CheckCircle2 } from 'lucide-react';
import { useSettings } from './SettingsContext';

export const SettingsPage: React.FC = () => {
  const { companyBudget, taxRate, updateSettings } = useSettings();
  const [budget, setBudget] = useState(companyBudget);
  const [tax, setTax] = useState(taxRate);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(Number(budget), Number(tax));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
              <Building size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Company Configuration</h2>
              <p className="text-slate-500 font-medium text-sm">Define global financial guardrails for your organization</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Monthly Budget */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <IndianRupee size={12} />
                Monthly Allocation Budget
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <span className="font-bold">₹</span>
                </div>
                <input 
                  type="number" 
                  min="0"
                  required
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all text-xl font-black text-slate-900"
                  placeholder="500,000"
                />
              </div>
              <p className="text-xs text-slate-400 font-medium pl-1">Used for dashboard comparisons and automated budget health alerts.</p>
            </div>

            {/* Tax Rate */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Percent size={12} />
                Global Tax Deduction Rate
              </label>
              <div className="relative group">
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <span className="font-bold">%</span>
                </div>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  required
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all text-xl font-black text-slate-900"
                  placeholder="15"
                />
              </div>
              <p className="text-xs text-slate-400 font-medium pl-1">Auto-calculates standard deductions during payroll and PDF generation.</p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-slate-50">
            <div className={`flex items-center gap-2 text-emerald-600 font-bold text-sm transition-all duration-300 ${showSuccess ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
              <CheckCircle2 size={18} />
              Settings saved successfully!
            </div>
            
            <button 
              type="submit"
              className="flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest"
            >
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Simulation Engine</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">Changes to tax rates will reflect instantly on all ungenerated payslips across the workforce.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Budget Guardrails</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">System automatically flags expenditures exceeding the Monthly Allocation Budget on the dashboard.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Persistence</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">Configurations are stored locally for consistent offline access across browser sessions.</p>
        </div>
      </div>
    </div>
  );
};
