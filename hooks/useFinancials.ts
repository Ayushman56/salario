
import { useMemo } from 'react';
import { Employee } from '../types';

export const useFinancials = (employees: Employee[], budgetLimit: number) => {
  return useMemo(() => {
    // 1. Core Calculations
    const totalMonthlyPayroll = employees.reduce((acc, emp) => acc + emp.monthlyIncome, 0);
    const savingsMargin = budgetLimit - totalMonthlyPayroll;
    const utilizationRate = budgetLimit > 0 ? (totalMonthlyPayroll / budgetLimit) * 100 : 0;
    const employeeCount = employees.length;
    const avgSalary = employeeCount > 0 ? totalMonthlyPayroll / employeeCount : 0;

    // 2. Department Distribution (Donut Chart Data)
    const departmentMap = employees.reduce((acc: Record<string, number>, emp) => {
      // Use position as department/role
      acc[emp.position] = (acc[emp.position] || 0) + emp.monthlyIncome;
      return acc;
    }, {});

    const departmentDistribution = Object.entries(departmentMap).map(([name, value]) => ({
      name,
      value
    }));

    // 3. Payroll Trends (Area Chart Data)
    // Jan-May are mock historicals, Jun is live data
    const payrollTrends = [
      { name: 'Jan', amount: 315000 },
      { name: 'Feb', amount: 338000 },
      { name: 'Mar', amount: 322000 },
      { name: 'Apr', amount: 375000 },
      { name: 'May', amount: 410000 },
      { name: 'Jun', amount: totalMonthlyPayroll },
    ];

    // 4. Budget Analysis (Bar Chart Data)
    // Structured for side-by-side comparison in a single category
    const budgetAnalysis = [
      { 
        name: 'Analysis', 
        budget: budgetLimit, 
        actual: totalMonthlyPayroll 
      }
    ];

    return {
      totalMonthlyPayroll,
      budgetLimit,
      savingsMargin,
      utilizationRate,
      avgSalary,
      departmentDistribution,
      payrollTrends,
      budgetAnalysis,
      isOverBudget: savingsMargin < 0,
      employeeCount
    };
  }, [employees, budgetLimit]);
};
