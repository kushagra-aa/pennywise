import { db } from "~/db/schema";
import type { ExpenseType } from "~/types";

export const expenseService = {
  // Get all expenses
  getAll: async (): Promise<ExpenseType[]> => {
    return await db.expenses.orderBy("date").reverse().toArray();
  },

  // Get expenses by account
  getByAccount: async (accountId: string): Promise<ExpenseType[]> => {
    return await db.expenses
      .where("accountId")
      .equals(accountId)
      .sortBy("date");
  },

  // Get expenses in date range
  getByDateRange: async (
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseType[]> => {
    return await db.expenses
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  },

  // Get expenses by category
  getByCategory: async (category: string): Promise<ExpenseType[]> => {
    return await db.expenses.where("category").equals(category).toArray();
  },

  // Create expense
  create: async (
    data: Omit<ExpenseType, "id" | "createdAt">,
  ): Promise<string> => {
    const expense: ExpenseType = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    return await db.expenses.add(expense);
  },

  // Update expense
  update: async (id: string, data: Partial<ExpenseType>): Promise<void> => {
    await db.expenses.update(id, data);
  },

  // Delete expense
  delete: async (id: string): Promise<void> => {
    await db.expenses.delete(id);
  },

  // Get total expenses
  getTotalAmount: async (): Promise<number> => {
    const expenses = await db.expenses.toArray();
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  },

  // Get total by account
  getTotalByAccount: async (accountId: string): Promise<number> => {
    const expenses = await expenseService.getByAccount(accountId);
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  },

  // Bulk create
  createMany: async (
    expenses: Omit<ExpenseType, "id" | "createdAt">[],
  ): Promise<void> => {
    const expensesWithIds = expenses.map((exp) => ({
      id: crypto.randomUUID(),
      ...exp,
      createdAt: new Date(),
    }));
    await db.expenses.bulkAdd(expensesWithIds);
  },
};
