
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Settings, 
  LogOut, 
  Plus, 
  X,
  Briefcase
} from 'lucide-react';
import { User, Employee, AppView, CompanyStats } from './types';
import { Analytics } from './Analytics';
import { ChatAssistant } from './ChatAssistant';
import { SettingsProvider, useSettings } from './SettingsContext';
import { SettingsPage } from './SettingsPage';
import { EmployeeList } from './EmployeeList';
import { EditEmployeeModal } from './EditEmployeeModal';
import { LandingPage } from './LandingPage';

// --- Components ---

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick: () => void; 
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

// --- Main App Logic ---

function AppContent() {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('dashboard');
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'signup'>('login');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [authError, setAuthError] = useState('');
  
  const { companyBudget, taxRate } = useSettings();
  
  // Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [employeeForm, setEmployeeForm] = useState({ fullName: '', email: '', position: '', monthlyIncome: '', dateOfJoining: '' });
  
  useEffect(() => {
    const savedEmployees = localStorage.getItem('salario_employees');
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));

    const loggedUser = localStorage.getItem('salario_user');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
      setShowLanding(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('salario_employees', JSON.stringify(employees));
  }, [employees]);

  const stats: CompanyStats = {
    employeeCount: employees.length,
    totalExpenditure: employees.reduce((acc, curr) => acc + Number(curr.monthlyIncome), 0),
    totalBudget: companyBudget,
    remainingBudget: companyBudget - employees.reduce((acc, curr) => acc + Number(curr.monthlyIncome), 0)
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('salario_users') || '[]');
    const foundUser = users.find((u: User) => u.email === loginForm.email && u.password === loginForm.password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('salario_user', JSON.stringify(foundUser));
      setAuthError('');
    } else {
      setAuthError('Credentials not found. If you are new, please Sign Up.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      username: signupForm.username,
      email: signupForm.email,
      password: signupForm.password
    };
    const users = JSON.parse(localStorage.getItem('salario_users') || '[]');
    users.push(newUser);
    localStorage.setItem('salario_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('salario_user', JSON.stringify(newUser));
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: Employee = {
      id: Date.now().toString(),
      fullName: employeeForm.fullName,
      email: employeeForm.email,
      position: employeeForm.position,
      monthlyIncome: Number(employeeForm.monthlyIncome),
      dateOfJoining: employeeForm.dateOfJoining,
      status: 'Active'
    };
    setEmployees([...employees, newEmp]);
    setShowAddModal(false);
    setEmployeeForm({ fullName: '', email: '', position: '', monthlyIncome: '', dateOfJoining: '' });
  };

  const handleUpdateEmployee = (updatedData: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedData.id ? updatedData : emp));
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to terminate this record? This action is irreversible.')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const generatePDF = (emp: Employee) => {
    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('SALARIO', 20, 25);
    doc.setFontSize(12);
    doc.text('OFFICIAL PAYSLIP', 160, 25);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text(`Employee Details`, 20, 60);
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    doc.setFontSize(11);
    doc.text(`Name: ${emp.fullName}`, 20, 75);
    doc.text(`Position: ${emp.position}`, 20, 85);
    doc.text(`Email: ${emp.email}`, 20, 95);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 105);

    const basePay = emp.monthlyIncome;
    const taxValue = basePay * (taxRate / 100);
    const netPay = basePay - taxValue;

    doc.setFontSize(14);
    doc.text(`Earnings Breakdown`, 20, 125);
    doc.line(20, 130, 190, 130);
    doc.setFontSize(11);
    doc.text(`Basic Salary:`, 20, 140);
    doc.text(`INR ${basePay.toLocaleString()}`, 160, 140, { align: 'right' });
    doc.text(`Tax Deductions (${taxRate}%):`, 20, 150);
    doc.text(`-INR ${taxValue.toLocaleString()}`, 160, 150, { align: 'right' });

    doc.setFillColor(248, 250, 252);
    doc.rect(20, 160, 170, 15, 'F');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`NET PAYABLE:`, 25, 170);
    doc.text(`INR ${netPay.toLocaleString()}`, 160, 170, { align: 'right' });

    doc.save(`Payslip_${emp.fullName.replace(' ', '_')}.pdf`);
  };

  if (showLanding && !user) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="bg-emerald-600 p-10 text-center">
            <h1 className="text-4xl font-black text-white tracking-tighter">Salario</h1>
            <p className="text-emerald-100 mt-2 font-medium opacity-80 italic">Precision Payroll & Analytics</p>
          </div>
          <div className="p-10">
            <div className="flex gap-2 mb-10 bg-slate-50 p-1.5 rounded-2xl">
              <button 
                onClick={() => { setIsAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${isAuthMode === 'login' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Log In
              </button>
              <button 
                onClick={() => { setIsAuthMode('signup'); setAuthError(''); }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${isAuthMode === 'signup' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
                <div className="p-1 bg-red-100 rounded-full"><X size={14} /></div>
                <span>{authError}</span>
              </div>
            )}

            {isAuthMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest pl-1">Business Email</label>
                  <input 
                    type="email" 
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all text-sm font-medium"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest pl-1">Secure Password</label>
                  <input 
                    type="password" 
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest">
                  Secure Access
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest pl-1">Username</label>
                  <input 
                    type="text" 
                    required
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all text-sm font-medium"
                    placeholder="Administrator"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest pl-1">Business Email</label>
                  <input 
                    type="email" 
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all text-sm font-medium"
                    placeholder="admin@salario.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest pl-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest pl-1">Verify Password</label>
                  <input 
                    type="password" 
                    required
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest">
                  Initialize System
                </button>
              </form>
            )}
            <button 
              onClick={() => setShowLanding(true)}
              className="w-full mt-6 text-slate-400 font-bold text-xs hover:text-emerald-600 transition-colors uppercase tracking-widest"
            >
              ← Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-slate-900 flex flex-col p-6 border-r border-slate-800 shrink-0 print:hidden">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/50">
            S
          </div>
          <span className="text-white font-black text-2xl tracking-tighter">Salario</span>
        </div>
        
        <nav className="flex-1 space-y-3">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Employees" 
            active={view === 'employees'} 
            onClick={() => setView('employees')} 
          />
          <SidebarItem 
            icon={<Receipt size={20} />} 
            label="Payroll" 
            active={view === 'payroll'} 
            onClick={() => setView('payroll')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={view === 'settings'} 
            onClick={() => setView('settings')} 
          />
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-6">
          <div className="px-4 py-4 mb-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Administrator</p>
            <p className="text-white font-bold text-sm truncate">{user.username}</p>
          </div>
          <button 
            onClick={() => { setUser(null); localStorage.removeItem('salario_user'); setShowLanding(true); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10 print:p-0 print:bg-white animate-in fade-in duration-500">
        {view === 'dashboard' ? (
          <Analytics 
            employees={employees} 
            budget={companyBudget} 
            userName={user.username} 
          />
        ) : view === 'settings' ? (
          <>
            <header className="flex justify-between items-center mb-10 print:hidden">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuration</h1>
                <p className="text-slate-500 font-medium mt-1">Manage global system parameters and guardrails</p>
              </div>
            </header>
            <SettingsPage />
          </>
        ) : (
          <>
            <header className="flex justify-between items-center mb-10 print:hidden">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                  Manage business {view} and records
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest"
              >
                <Plus size={18} />
                Add Employee
              </button>
            </header>

            {view === 'employees' && (
              <EmployeeList 
                employees={employees} 
                onEdit={(emp) => setEditingEmployee(emp)} 
                onDelete={handleDeleteEmployee}
                onAddTrigger={() => setShowAddModal(true)}
              />
            )}

            {view === 'payroll' && (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Employee</th>
                        <th className="px-8 py-5">Base Income</th>
                        <th className="px-8 py-5">Tax ({taxRate}%)</th>
                        <th className="px-8 py-5">Net Payable</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{emp.fullName}</p>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{emp.position}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-700">₹{emp.monthlyIncome.toLocaleString('en-IN')}</td>
                          <td className="px-8 py-5 text-sm font-bold text-red-500">-₹{(emp.monthlyIncome * (taxRate / 100)).toLocaleString('en-IN')}</td>
                          <td className="px-8 py-5 text-sm font-black text-emerald-600">₹{(emp.monthlyIncome * (1 - taxRate / 100)).toLocaleString('en-IN')}</td>
                          <td className="px-8 py-5 text-right">
                            <button 
                              onClick={() => generatePDF(emp)}
                              className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors border border-slate-200"
                            >
                              Download Slip
                            </button>
                          </td>
                        </tr>
                      ))}
                      {employees.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-8 py-24 text-center">
                            <p className="text-slate-400 font-bold italic">Payroll data inaccessible. Populate workforce records first.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6 print:hidden">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-900 p-8 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-emerald-500 rounded-xl text-white"><Briefcase size={20} /></div>
                Enlist Employee
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={28} />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Legal Name</label>
                  <input 
                    type="text" 
                    required 
                    value={employeeForm.fullName}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none font-bold" 
                    placeholder="E.g. Siddharth Roy"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">System Email</label>
                  <input 
                    type="email" 
                    required 
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none font-bold" 
                    placeholder="sid@salario.tech"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Organization Role</label>
                  <select 
                    required 
                    value={employeeForm.position}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none font-bold appearance-none"
                  >
                    <option value="">Choose Position</option>
                    <option value="Lead Designer">Lead Designer</option>
                    <option value="Senior Engineer">Senior Engineer</option>
                    <option value="Junior Engineer">Junior Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Marketing Lead">Marketing Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Monthly Salary (INR)</label>
                  <input 
                    type="number" 
                    required 
                    value={employeeForm.monthlyIncome}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, monthlyIncome: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none font-black text-emerald-600" 
                    placeholder="E.g. 75000"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Deployment Date</label>
                  <input 
                    type="date" 
                    required 
                    value={employeeForm.dateOfJoining}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, dateOfJoining: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none font-bold" 
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 uppercase tracking-widest"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-100 uppercase tracking-widest"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <EditEmployeeModal 
          employee={editingEmployee} 
          onClose={() => setEditingEmployee(null)} 
          onUpdate={handleUpdateEmployee} 
        />
      )}

      {/* Intelligent Chat Assistant - Passing employees here */}
      <ChatAssistant 
        user={user} 
        stats={stats} 
        employees={employees}
        onTriggerAddEmployee={() => { setView('employees'); setShowAddModal(true); }} 
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
