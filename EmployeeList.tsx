
import React from 'react';
import { Search, Users, Pencil, Trash2 } from 'lucide-react';
import { Employee } from './types';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onAddTrigger: () => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit, onDelete, onAddTrigger }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'On Leave': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Terminated': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center print:hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search workforce..." 
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 w-80 transition-all"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-5">Full Name</th>
              <th className="px-8 py-5">Position</th>
              <th className="px-8 py-5">Monthly Income</th>
              <th className="px-8 py-5">Joining Date</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs border border-emerald-100">
                      {emp.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{emp.fullName}</p>
                      <p className="text-slate-400 text-xs font-medium">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-slate-600">{emp.position}</td>
                <td className="px-8 py-5 text-sm font-black text-slate-900">₹{emp.monthlyIncome.toLocaleString('en-IN')}</td>
                <td className="px-8 py-5 text-sm font-medium text-slate-500">{emp.dateOfJoining}</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(emp.status)}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(emp)}
                      className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      title="Edit Employee"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(emp.id)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Employee"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-4">
                      <Users size={32} />
                    </div>
                    <p className="text-slate-400 font-bold">No personnel records found.</p>
                    <button onClick={onAddTrigger} className="text-emerald-600 text-sm font-black mt-2 hover:underline">Add your first employee →</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
