
import React, { useState, useEffect } from 'react';
import { X, Save, Pencil, Briefcase, User as UserIcon } from 'lucide-react';
import { Employee, EmployeeStatus } from './types';

interface EditEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: (updatedData: Employee) => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ employee, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Employee>(employee);

  useEffect(() => {
    setFormData(employee);
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.monthlyIncome < 0) return;
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-slate-900 p-8 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-emerald-500 rounded-xl text-white"><Pencil size={20} /></div>
            Edit Employee Details
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                   <UserIcon size={18} />
                </div>
                <input 
                  type="text" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none font-bold" 
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Email Address (System ID)</label>
              <input 
                type="email" 
                disabled 
                value={formData.email}
                className="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-400 cursor-not-allowed" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Current Position</label>
              <select 
                required 
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none font-bold appearance-none"
              >
                <option value="Lead Designer">Lead Designer</option>
                <option value="Senior Engineer">Senior Engineer</option>
                <option value="Junior Engineer">Junior Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Marketing Lead">Marketing Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Employment Status</label>
              <select 
                required 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none font-bold appearance-none"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest pl-1">Monthly Salary (INR)</label>
              <input 
                type="number" 
                required 
                min="0"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none font-black text-emerald-600" 
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 uppercase tracking-widest transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-100 uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
