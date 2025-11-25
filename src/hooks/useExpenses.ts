import { createResource, createSignal } from "solid-js";
import { toast } from "~/components/ui/Toast";
import { checkString } from "~/lib/utils";
import { expenseService } from "~/services/expenses.service";
import type { ExpenseType } from "~/types";

const fetchExpenses = async (filters: {
  category: string;
  accountID: string;
  dateRange: { start: string; end: string };
}) => {
  const { category, accountID, dateRange } = filters;
  try {
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
    category: "",
    accountID: "",
    dateRange: { start: "", end: "" },
  });

  const [expenses, { refetch }] = createResource(filters, fetchExpenses);

  const filter = (cat?: string, acc?: string) => {
    setFilters((p) => ({ ...p, category: cat ?? "", accountID: acc ?? "" }));
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
