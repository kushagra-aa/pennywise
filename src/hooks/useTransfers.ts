import { createResource, createSignal } from "solid-js";
import { toast } from "~/components/ui/Toast";
import { checkString } from "~/lib/utils";
import { expenseService } from "~/services/expenses.service";
import { incomeService } from "~/services/incomes.service";
import { transferService } from "~/services/transfers.service";
import type { ExpenseType, IncomeType, TransferType } from "~/types";

export type TransferFullType = TransferType & {
  expense?: ExpenseType;
  income?: IncomeType;
};

const fetchTransfers = async (filters: {
  dateRange: { start: string; end: string };
}) => {
  const { dateRange } = filters;
  try {
    if (checkString(dateRange.start) || checkString(dateRange.end)) {
      return await transferService.getByDateRange(
        new Date(dateRange.start),
        new Date(dateRange.end)
      );
    }
    return await transferService.getAll();
  } catch (err) {
    toast.error("Failed to load transfers");
    console.error(err);
    return [];
  }
};

const getTransfersWithTransactions = async (filters: {
  dateRange: { start: string; end: string };
}) => {
  const transfers = await fetchTransfers(filters);
  const fullTransfers = await Promise.all(
    transfers.map<Promise<TransferFullType>>(async (t) => {
      const expense = await expenseService.getByID(t.fromAccountID);
      const income = await incomeService.getByID(t.toAccountID);
      return { ...t, expense, income };
    })
  );
  return fullTransfers;
};

export const useTransfers = () => {
  const [filters, setFilters] = createSignal({
    dateRange: { start: "", end: "" },
  });

  const [transfers, { refetch }] = createResource(
    filters,
    getTransfersWithTransactions
  );

  const filterByDateRange = (start: string, end: string) => {
    setFilters((p) => ({ ...p, dateRange: { start, end } }));
  };

  const create = async (data: Omit<TransferType, "id" | "createdAt">) => {
    try {
      await transferService.create(data);
      toast.success("Transfer created successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to create transfer");
      throw error;
    }
  };

  const update = async (id: string, data: Partial<TransferType>) => {
    try {
      await transferService.update(id, data);
      toast.success("Transfer updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update transfer");
      throw error;
    }
  };

  const deleteTransfer = async (id: string) => {
    try {
      await transferService.delete(id);
      toast.success("Transfer deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete transfer");
      throw error;
    }
  };

  return {
    transfers,
    loading: () => !!transfers.loading,
    error: () => transfers.error,
    refresh: refetch,
    create,
    update,
    filters,
    filterByDateRange,
    delete: deleteTransfer,
  };
};
