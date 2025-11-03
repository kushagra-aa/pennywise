export interface Profile {
  id: string;
  monthlyIncome: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  type: "credit_card" | "debit_card" | "bank_account";
  balance?: number;
  creditLimit?: number;
  billingCycleStart?: number; // Day of month (1-31)
  billingCycleEnd?: number; // Day of month (1-31)
  createdAt: Date;
}

export interface Expense {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface ExportData {
  version: string;
  exportDate: string;
  profile: Profile | null;
  accounts: Account[];
  expenses: Expense[];
}
