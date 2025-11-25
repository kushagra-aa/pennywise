// Indexed DB does not support booleans
export type BooleanType = 0 | 1;

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
  billingCycleStart?: number; // day of month
  billingCycleEnd?: number;
  createdAt: Date;
}

export interface ExpenseType {
  id: string;
  accountId?: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
  recurringId?: string; // points to Recurring template
  isEMI?: BooleanType; //Boolean
  transferID?: string;
  createdAt: Date;
}

export interface IncomeType {
  id: string;
  accountId?: string; // optional account to credit
  amount: number;
  category?: string;
  description?: string;
  date: Date;
  recurringId?: string;
  transferID?: string;
  createdAt: Date;
}

export type RecurringKind = "expense" | "income" | "emi";
export interface RecurringType {
  id: string;
  dayOfMonth: number; // 1..31
  amount: number;
  accountId: string;
  description: string;
  type: RecurringKind;
  isActive: BooleanType; //Boolean // togglable
  category?: string;
  // for EMI specific:
  totalAmount?: number; // total loan amount
  installments?: number; // total months
  installmentsPaid?: number; // months already generated
  monthlyAmount?: number; // derived or given
  startDate?: Date; // first due date
  lastTriggeredAt?: Date; // optional
  createdAt: Date;
}

export interface TransferType {
  id: string;
  fromAccountID: string;
  toAccountID: string;
  amount: number;
  date: Date;
  description?: string;
  // We will also create two Expense/Income rows on transfer:
  createdAt: Date;
}
