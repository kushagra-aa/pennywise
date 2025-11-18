export interface ProfileType {
  id: string;
  monthlyIncome: number;
  currency: string;
  monthlyBudget?: number; // global monthly budget
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountType {
  id: string;
  name: string;
  type: "credit_card" | "debit_card" | "bank_account";
  balance?: number;
  creditLimit?: number;
  billingCycleStart?: number | null; // day of month
  billingCycleEnd?: number | null;
  createdAt: Date;
}

export interface ExpenseType {
  id: string;
  accountId: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
  createdAt: Date;
  isEMI?: boolean;
  recurringId?: string | null; // points to Recurring template
}

export interface IncomeType {
  id: string;
  accountId?: string; // optional account to credit
  amount: number;
  category?: string;
  description?: string;
  date: Date;
  createdAt: Date;
  recurringId?: string | null;
}

export interface RecurringType {
  id: string;
  // simple monthly rule for v1:
  dayOfMonth: number; // 1..31 (2 => every month on 2nd)
  amount: number;
  accountId?: string;
  category?: string;
  description?: string;
  type: "expense" | "income";
  createdAt: Date;
  lastTriggeredAt?: Date | null;
}

export interface TransferType {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: Date;
  description?: string;
  // We will also create two Expense/Income rows on transfer:
  createdAt: Date;
}
