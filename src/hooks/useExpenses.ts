import { createResource, createSignal } from "solid-js";
import { toast } from "~/components/ui/Toast";
import { checkString } from "~/lib/utils";
import { expenseService } from "~/services/expenses.service";
import type { ExpenseType } from "~/types";
import {
  RECURRING_FILTER_OPTIONS,
  type RecurringFilterEnum,
} from "./useTransactions";

const fetchExpenses = async (filters: {
  recurringFilter: RecurringFilterEnum;
  category: string;
  accountID: string;
  dateRange: { start: string; end: string };
}) => {
  const { category, accountID, dateRange, recurringFilter } = filters;
  try {
    if (recurringFilter !== "all") {
      if (recurringFilter === "no_recurring")
        return await expenseService.getAllWithoutRecurring();
      if (recurringFilter === "recurring")
        return await expenseService.getAllOnlyRecurring();
    }
    if (
      checkString(category) &&
      checkString(accountID) &&
      (checkString(dateRange.start) || checkString(dateRange.end))
    ) {
      return await expenseService.getByCategoryAndAccountAndDateRange(
        category,
        accountID,
        new Date(dateRange.start),
        new Date(dateRange.end)
      );
    }
    if (checkString(dateRange.start) || checkString(dateRange.end)) {
      return await expenseService.getByDateRange(
        new Date(dateRange.start),
        new Date(dateRange.end)
      );
    }
    if (checkString(category) && checkString(accountID)) {
      return await expenseService.getByCategoryAndAccount(category, accountID);
    }
    if (checkString(category)) {
      return await expenseService.getByCategory(category);
    }
    if (checkString(accountID)) {
      return await expenseService.getByAccount(accountID);
    }
    return await expenseService.getAllWithoutTransfer();
  } catch (err) {
    toast.error("Failed to load expenses");
    console.error(err);
    return [];
  }
};

export const useExpenses = () => {
  const [filters, setFilters] = createSignal({
    recurringFilter: RECURRING_FILTER_OPTIONS[0].value,
    category: "",
    accountID: "",
    dateRange: { start: "", end: "" },
  });

  const [expenses, { refetch }] = createResource(filters, fetchExpenses);

  const filter = (rec: RecurringFilterEnum, cat?: string, acc?: string) => {
    setFilters((p) => ({
      ...p,
      recurringFilter: rec,
      category: cat ?? "",
      accountID: acc ?? "",
    }));
  };

  const filterByDateRange = (start: string, end: string) => {
    setFilters((p) => ({ ...p, dateRange: { start, end } }));
  };

  const create = async (data: Omit<ExpenseType, "id" | "createdAt">) => {
    try {
      await expenseService.create(data);
      toast.success("Expense created successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to create expense");
      throw error;
    }
  };

  const update = async (id: string, data: Partial<ExpenseType>) => {
    try {
      await expenseService.update(id, data);
      toast.success("Expense updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update expense");
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expenseService.delete(id);
      toast.success("Expense deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete expense");
      throw error;
    }
  };

  return {
    expenses,
    loading: () => !!expenses.loading,
    error: () => expenses.error,
    refresh: refetch,
    create,
    update,
    filter,
    filters,
    filterByDateRange,
    delete: deleteExpense,
  };
};
