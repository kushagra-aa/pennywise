import Dexie, { type Table } from "dexie";
import type { Profile, Account, Expense } from "~/types";

export class ExpenseTrackerDB extends Dexie {
  profile!: Table<Profile, string>;
  accounts!: Table<Account, string>;
  expenses!: Table<Expense, string>;

  constructor() {
    super("ExpenseTrackerDB");

    this.version(1).stores({
      profile: "id, monthlyIncome, updatedAt",
      accounts: "id, name, type, billingCycleStart, createdAt",
      expenses: "id, accountId, amount, category, date, createdAt",
    });
  }
}

export const db = new ExpenseTrackerDB();
