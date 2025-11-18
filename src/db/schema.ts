import Dexie, { type Table } from "dexie";
import type {
  AccountType,
  ExpenseType,
  IncomeType,
  ProfileType,
  RecurringType,
  TransferType,
} from "~/types";

export class ExpenseTrackerDB extends Dexie {
  profile!: Table<ProfileType, string>;
  accounts!: Table<AccountType, string>;
  expenses!: Table<ExpenseType, string>;
  incomes!: Table<IncomeType, string>;
  recurrings!: Table<RecurringType, string>;
  transfers!: Table<TransferType, string>;

  constructor() {
    super("pennywise_db");
    this.version(1).stores({
      profile: "id, createdAt",
      accounts: "id, name, type, createdAt",
      expenses: "id, accountId, date, category, createdAt",
      incomes: "id, accountId, date, createdAt",
      recurrings: "id, dayOfMonth, type, createdAt",
      transfers: "id, fromAccountId, toAccountId, date, createdAt",
    });
  }
}

export const db = new ExpenseTrackerDB();
