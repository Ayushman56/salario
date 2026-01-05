
import React, { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  AlertCircle,
  Download,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  FileSpreadsheet
} from 'lucide-react';
import { useFinancials } from './hooks/useFinancials';
import { Employee } from './types';

interface AnalyticsProps {
  employees: Employee[];
  budget: number;
  userName: string;
}

const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#f59e0b', '#8b5cf6', '#ec4899'];

const formatINR = (val: number) => 
  new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(val);

export const Analytics: React.FC<AnalyticsProps> = ({ employees, budget, userName }) => {
  const {
    totalMonthlyPayroll,
    budgetLimit,
    savingsMargin,
    utilizationRate,
    avgSalary,
    departmentDistribution,
    payrollTrends,
    budgetAnalysis,
    isOverBudget
  } = useFinancials(employees, budget);

  const [timeFilter, setTimeFilter] = useState('This Month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExportReport = () => {
    const reportDate = new Date().toISOString().split('T')[0];
    const csvRows = [
      ["Metric", "Value"],
      ["Time Period", timeFilter],
      ["Administrator", userName],
      ["Total Payroll", `₹${totalMonthlyPayroll}`],
      ["Budget Limit", `₹${budgetLimit}`],
      ["Savings Margin", `₹${savingsMargin}`],
      ["Efficiency Ratio", `${utilizationRate.toFixed(1)}%`],
      ["Employee Count", employees.length.toString()],
      ["Average Salary", `₹${avgSalary.toFixed(0)}`]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Salario_Report_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timeOptions = ["This Month", "Last Month", "Last Quarter", "Year to Date"];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back, {userName}!</h1>
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 ${
              isOverBudget 
                ? 'bg-red-50 text-red-600 border-red-100' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
              <span className="text-xs font-black uppercase tracking-widest">
                {isOverBudget ? 'Over Budget' : 'On Track'}
              </span>
            </div>
          </div>
          <p className="text-slate-500 font-bold text-sm tracking-wide">
            Corporate Financial Brain • Internal Audit Q2 2024
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white border-2 border-slate-100 px-5 py-3 rounded-2xl text-sm font-black text-slate-700 hover:border-emerald-200 transition-all shadow-sm"
            >
              <Calendar size={18} className="text-emerald-500" />
              {timeFilter}
              <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {timeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setTimeFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                      timeFilter === option ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200"
          >
            <FileSpreadsheet size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Savings Margin */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className={`p-4 rounded-2xl w-fit mb-6 ${isOverBudget ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Wallet size={28} />
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Savings Margin</h3>
            <p className={`text-4xl font-black tracking-tighter ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>
              {formatINR(savingsMargin)}
            </p>
            <p className="text-xs text-slate-400 mt-3 font-bold opacity-70">Remaining from allocated budget</p>
          </div>
        </div>

        {/* Efficiency Ratio */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Efficiency Ratio</h3>
            <span className="text-2xl font-black text-slate-900">{utilizationRate.toFixed(1)}%</span>
          </div>
          <div className="h-6 bg-slate-100 rounded-2xl overflow-hidden mb-6 p-1">
            <div 
              className={`h-full rounded-xl transition-all duration-1000 ${isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(100, utilizationRate)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 font-bold opacity-70 flex items-center gap-2">
            <AlertCircle size={14} className="text-emerald-500" />
            Live resource utilization index
          </p>
        </div>

        {/* Avg. Salary */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                <Users size={28} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-emerald-100 shadow-sm">
                <ArrowUpRight size={14} strokeWidth={3} />
                2.4% vs L.M
              </div>
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Avg. Salary / Employee</h3>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">
              {formatINR(avgSalary)}
            </p>
            <p className="text-xs text-slate-400 mt-3 font-bold opacity-70">Cost-per-person optimization metrics</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Payroll Trends - Area Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Payroll Trends</h3>
              <p className="text-sm text-slate-500 font-bold">6-month expenditure growth analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Actual Spend</span>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payrollTrends}>
                <defs>
                  <linearGradient id="liveTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 900, fill: '#94a3b8' }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#cbd5e1' }} 
                  dx={-15} 
                  tickFormatter={(val) => `₹${val/1000}k`} 
                />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                  formatter={(value: number) => [formatINR(value), 'Monthly Cost']}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#liveTrend)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Analysis - Bar Chart */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-12">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Budget Analysis</h3>
            <p className="text-sm text-slate-500 font-bold">Limit vs Actual Spend</p>
          </div>
          <div className="flex-1 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetAnalysis}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#cbd5e1' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => formatINR(value)}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '30px' }} />
                <Bar name="Budget Limit" dataKey="budget" fill="#10b981" radius={[12, 12, 0, 0]} barSize={60} />
                <Bar name="Actual Spend" dataKey="actual" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Status</span>
              <span className={`text-sm font-black ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`}>
                {isOverBudget ? 'Excess Spend' : 'Within Threshold'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Department Cost Center</h3>
            <p className="text-sm text-slate-500 font-bold">Granular distribution of salary expenditure per role</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm border border-emerald-100 shadow-sm">
            Total Distributed: {formatINR(totalMonthlyPayroll)}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-5/12 h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={160}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {departmentDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatINR(value)}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {departmentDistribution.map((item, i) => (
              <div key={i} className="flex flex-col p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {((item.value / totalMonthlyPayroll) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors">
                    {formatINR(item.value)}
                  </span>
                  <div className="w-12 h-1 bg-slate-200 rounded-full group-hover:bg-emerald-300 transition-colors" />
                </div>
              </div>
            ))}
            {departmentDistribution.length === 0 && (
              <div className="col-span-full py-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                <Users size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-black italic tracking-tight">No workforce clusters detected. Onboard personnel to visualize data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
