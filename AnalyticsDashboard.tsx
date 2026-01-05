
import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Wallet, 
  Zap, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { Employee } from './types';

interface AnalyticsDashboardProps {
  employees: Employee[];
  budget: number;
  userName: string;
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(val);

export const calculatePayrollStats = (employees: Employee[], budget: number) => {
  const totalPayroll = employees.reduce((acc, emp) => acc + emp.monthlyIncome, 0);
  const employeeCount = employees.length;
  const savingsMargin = budget - totalPayroll;
  const utilization = budget > 0 ? (totalPayroll / budget) * 100 : 0;
  const perEmployeeCost = employeeCount > 0 ? totalPayroll / employeeCount : 0;
  
  return {
    totalPayroll,
    savingsMargin,
    utilization,
    perEmployeeCost,
    employeeCount
  };
};

const COLORS = ['#10b981', '#334155', '#64748b', '#94a3b8', '#1e293b', '#475569'];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ employees, budget, userName }) => {
  const stats = calculatePayrollStats(employees, budget);
  
  // Aggregate data for Pie Chart
  const departmentData = employees.reduce((acc: any[], emp) => {
    const existing = acc.find(item => item.name === emp.position);
    if (existing) {
      existing.value += emp.monthlyIncome;
    } else {
      acc.push({ name: emp.position, value: emp.monthlyIncome });
    }
    return acc;
  }, []);

  // Comparison data for Bar Chart
  const budgetVsActual = [
    { name: 'Allocated Budget', value: budget, fill: '#cbd5e1' },
    { name: 'Total Payroll', value: stats.totalPayroll, fill: '#10b981' }
  ];

  const currentDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, {userName}!</h1>
          <p className="text-slate-500 font-bold uppercase text-xs mt-1 tracking-widest">{currentDate}</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-slate-400 uppercase">Live System Status</p>
          <div className="flex items-center gap-2 justify-end mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-600 font-bold text-sm">Operational</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Savings Margin */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${stats.savingsMargin >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <Wallet size={24} />
            </div>
            {stats.savingsMargin < 0 && (
              <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-1 rounded-full uppercase tracking-tighter">Budget Overrun</span>
            )}
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Savings Margin</h3>
          <p className={`text-3xl font-black mt-1 ${stats.savingsMargin >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
            {formatCurrency(stats.savingsMargin)}
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Active payroll vs allocated company budget</p>
        </div>

        {/* Efficiency Ratio */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-900 text-white rounded-2xl">
              <Zap size={24} />
            </div>
            <span className="text-xs font-bold text-slate-900">{stats.utilization.toFixed(1)}%</span>
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Efficiency Ratio</h3>
          <p className="text-3xl font-black text-slate-900 mt-1">Utilization</p>
          <div className="mt-4 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${stats.utilization > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(100, stats.utilization)}%` }}
            ></div>
          </div>
        </div>

        {/* Avg. Salary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Avg. Salary / Employee</h3>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {formatCurrency(stats.perEmployeeCost)}
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Cost distributed among {stats.employeeCount} employees</p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Cost Center */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Department Cost Center</h3>
              <p className="text-sm text-slate-500 font-medium">Expenditure distribution across roles</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {departmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              {departmentData.length > 0 ? departmentData.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{formatCurrency(item.value)}</span>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm font-medium italic">No employee data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Budget vs Actual Bar Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Budget vs Actual</h3>
              <p className="text-sm text-slate-500 font-medium">Comparison of allocated limit vs current spend</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetVsActual} layout="vertical" margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#475569' }} width={100} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                  {budgetVsActual.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Net Status</span>
            <span className={`text-lg font-black ${stats.savingsMargin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.savingsMargin >= 0 ? 'Within Budget' : 'Deficit Detected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
