import Dexie, { type Table } from "dexie";
import type { AccountType, ExpenseType, ProfileType } from "~/types";

export class ExpenseTrackerDB extends Dexie {
  profile!: Table<ProfileType, string>;
  accounts!: Table<AccountType, string>;
  expenses!: Table<ExpenseType, string>;

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
