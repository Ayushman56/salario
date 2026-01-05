
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  companyBudget: number;
  taxRate: number;
}

interface SettingsContextType extends Settings {
  updateSettings: (newBudget: number, newTax: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('salario_settings');
    return saved ? JSON.parse(saved) : { companyBudget: 500000, taxRate: 15 };
  });

  const updateSettings = (newBudget: number, newTax: number) => {
    const newSettings = { companyBudget: newBudget, taxRate: newTax };
    setSettings(newSettings);
    localStorage.setItem('salario_settings', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
