
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  position: string;
  monthlyIncome: number;
  dateOfJoining: string;
  status: EmployeeStatus;
}

export interface CompanyStats {
  totalBudget: number;
  totalExpenditure: number;
  employeeCount: number;
  remainingBudget: number;
}

export type AppView = 'dashboard' | 'employees' | 'payroll' | 'settings';
