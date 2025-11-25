import { db } from "~/db/schema";
import type { TransferType } from "~/types";
import { expenseService } from "./expenses.service";
import { incomeService } from "./incomes.service";

export const transferService = {
  // Get all transfers
  getAll: async (): Promise<TransferType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await db.transfers.orderBy("date").reverse().toArray();
  },

  // Get transfers in date range
  getByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<TransferType[]> => {
    return await db.transfers
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  },

  getByID: async (id: string): Promise<TransferType | undefined> => {
    return await db.transfers.get({ id });
  },

  // Create transfer
  create: async (
    data: Omit<TransferType, "id" | "createdAt">
  ): Promise<Record<string, string>> => {
    const transferPayload: TransferType = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    const transferID = await db.transfers.add(transferPayload);
    // Create Expense for the from account
    const expenseID = await expenseService.create({
      amount: transferPayload.amount,
      category: "transfer",
      date: transferPayload.date,
      description: transferPayload.description,
      accountId: transferPayload.fromAccountID,
      transferID,
    });
    const incomeID = await incomeService.create({
      amount: transferPayload.amount,
      category: "transfer",
      date: transferPayload.date,
      description: transferPayload.description,
      accountId: transferPayload.toAccountID,
      transferID,
    });
    return { transferID, expenseID, incomeID };
  },

  // Update transfer
  update: async (
    id: string,
    data: Partial<Omit<TransferType, "fromAccountID" | "toAccountID" | "date">>
  ): Promise<void> => {
    const transfer = await db.transfers.get({ id });
    if (transfer) {
      await db.transfers.update(id, data);
      await expenseService.update(transfer.fromAccountID, {
        amount: data.amount,
        description: data.description,
      });
      await incomeService.update(transfer.toAccountID, {
        amount: data.amount,
        description: data.description,
      });
    }
  },

  // Delete transfer
  delete: async (id: string): Promise<void> => {
    const transfer = await db.transfers.get({ id });
    if (transfer) {
      await db.transfers.delete(id);
      await expenseService.delete(transfer.fromAccountID);
      await incomeService.delete(transfer.toAccountID);
    }
  },
};
