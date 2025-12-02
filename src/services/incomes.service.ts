import { db } from "~/db/schema";
import type { IncomeType } from "~/types";

export const incomeService = {
  // Get all incomes
  getAll: async (): Promise<IncomeType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await db.incomes.orderBy("date").reverse().toArray();
  },
  getAllWithoutTransfer: async (): Promise<IncomeType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await db.incomes
      .orderBy("date")
      .and((income) => !income.transferID)
      .reverse()
      .toArray();
  },
  getAllWithoutRecurring: async (): Promise<IncomeType[]> => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return await db.incomes
      .orderBy("date")
      .and((income) => !income.recurringId)
      .reverse()
      .toArray();
  },
  getAllOnlyRecurring: async (): Promise<IncomeType[]> => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    return await db.incomes
      .orderBy("date")
      .and((income) => !!income.recurringId)
      .reverse()
      .toArray();
  },

  // Get incomes by account
  getByAccount: async (accountId: string): Promise<IncomeType[]> => {
    return await db.incomes.where("accountId").equals(accountId).sortBy("date");
  },

  // Get incomes in date range
  getByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<IncomeType[]> => {
    return await db.incomes
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  },

  // Get incomes by recurring
  getByRecurring: async (recurringId: string): Promise<IncomeType[]> => {
    return await db.incomes.where("recurringId").equals(recurringId).toArray();
  },

  // Get incomes by category
  getByCategory: async (category: string): Promise<IncomeType[]> => {
    return await db.incomes.where("category").equals(category).toArray();
  },

  getByCategoryAndAccount: async (
    category: string,
    accountId: string
  ): Promise<IncomeType[]> => {
    return await db.incomes
      .where("category")
      .equals(category)
      .and((income) => income.accountId === accountId)
      .toArray();
  },

  getByCategoryAndAccountAndDateRange: async (
    category: string,
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IncomeType[]> => {
    return await db.incomes
      .where("date")
      .between(startDate, endDate, true, true)
      .and(
        (income) =>
          income.accountId === accountId && income.category === category
      )
      .toArray();
  },

  getByID: async (id: string): Promise<IncomeType | undefined> => {
    return await db.incomes.get({ id });
  },

  // Create income
  create: async (
    data: Omit<IncomeType, "id" | "createdAt">
  ): Promise<string> => {
    const income: IncomeType = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    return await db.incomes.add(income);
  },

  // Update income
  update: async (id: string, data: Partial<IncomeType>): Promise<void> => {
    await db.incomes.update(id, data);
  },

  // Delete income
  delete: async (id: string): Promise<void> => {
    await db.incomes.delete(id);
  },

  // Get total incomes
  getTotalAmount: async (): Promise<number> => {
    const incomes = await db.incomes.toArray();
    return incomes.reduce((sum, exp) => sum + exp.amount, 0);
  },

  // Get total by account
  getTotalByAccount: async (accountId: string): Promise<number> => {
    const incomes = await incomeService.getByAccount(accountId);
    return incomes.reduce((sum, exp) => sum + exp.amount, 0);
  },

  // Bulk create
  createMany: async (
    incomes: Omit<IncomeType, "id" | "createdAt">[]
  ): Promise<void> => {
    const incomesWithIds = incomes.map((exp) => ({
      id: crypto.randomUUID(),
      ...exp,
      createdAt: new Date(),
    }));
    await db.incomes.bulkAdd(incomesWithIds);
  },
};
