import { db } from "~/db/schema";
import type { AccountType } from "~/types";

export const accountService = {
  // Get all accounts
  getAll: async (): Promise<AccountType[]> => {
    return await db.accounts.orderBy("createdAt").reverse().toArray();
  },

  // Get single account
  getById: async (id: string): Promise<AccountType | undefined> => {
    return await db.accounts.get(id);
  },

  // Get accounts by type
  getByType: async (type: AccountType["type"]): Promise<AccountType[]> => {
    return await db.accounts.where("type").equals(type).toArray();
  },

  // Create account
  create: async (
    payload: Omit<AccountType, "id" | "createdAt">,
  ): Promise<string> => {
    const data: Omit<AccountType, "id" | "createdAt"> = {
      name: payload.name,
      type: payload.type,
    };
    // Check for Fields
    if (["bank_account", "debit_card"].includes(data.type)) {
      data.balance = payload.balance;
    }
    if (["credit_card"].includes(data.type)) {
      data.creditLimit = payload.creditLimit;
      data.billingCycleEnd = payload.billingCycleEnd;
      data.billingCycleStart = payload.billingCycleStart;
    }

    const account: AccountType = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    return await db.accounts.add(account);
  },

  // Update account
  update: async (id: string, data: Partial<AccountType>): Promise<void> => {
    await db.accounts.update(id, data);
  },

  // Delete account
  delete: async (id: string): Promise<void> => {
    await db.accounts.delete(id);
  },

  // Delete account with all expenses
  deleteWithExpenses: async (id: string): Promise<void> => {
    await db.transaction("rw", db.accounts, db.expenses, async () => {
      await db.expenses.where("accountId").equals(id).delete();
      await db.accounts.delete(id);
    });
  },

  // Get account count
  count: async (): Promise<number> => {
    return await db.accounts.count();
  },
};
