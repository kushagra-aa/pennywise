export interface ProfileType {
  id: string;
  monthlyIncome: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountType {
  id: string;
  name: string;
  type: "credit_card" | "debit_card" | "bank_account";
  balance?: number; // Null If CreditCard
  creditLimit?: number; // Null If Not CreditCard
  billingCycleStart?: number; // Day of month (1-31) // Null If Not CreditCard
  billingCycleEnd?: number; // Day of month (1-31) // Null If Not CreditCard
  createdAt: Date;
}

export interface ExpenseType {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface ExportDataType {
  version: string;
  exportDate: string;
  profile: ProfileType | null;
  accounts: AccountType[];
  expenses: ExpenseType[];
}
