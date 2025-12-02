import { createResource, createSignal } from "solid-js";
import { toast } from "~/components/ui/Toast";
import { checkString } from "~/lib/utils";
import { incomeService } from "~/services/incomes.service";
import type { IncomeType } from "~/types";
import {
  RECURRING_FILTER_OPTIONS,
  type RecurringFilterEnum,
} from "./useTransactions";

const fetchIncomes = async (filters: {
  recurringFilter: RecurringFilterEnum;
  category: string;
  accountID: string;
  dateRange: { start: string; end: string };
}) => {
  const { category, accountID, dateRange, recurringFilter } = filters;
  try {
    console.log("recurringFilter :>> ", recurringFilter);
    if (recurringFilter !== "all") {
      if (recurringFilter === "no_recurring")
        return await incomeService.getAllWithoutRecurring();
      if (recurringFilter === "recurring")
        return await incomeService.getAllOnlyRecurring();
    }
    if (
      checkString(category) &&
      checkString(accountID) &&
      (checkString(dateRange.start) || checkString(dateRange.end))
    ) {
      return await incomeService.getByCategoryAndAccountAndDateRange(
        category,
        accountID,
        new Date(dateRange.start),
        new Date(dateRange.end)
      );
    }
    if (checkString(dateRange.start) || checkString(dateRange.end)) {
      return await incomeService.getByDateRange(
        new Date(dateRange.start),
        new Date(dateRange.end)
      );
    }
    if (checkString(category) && checkString(accountID)) {
      return await incomeService.getByCategoryAndAccount(category, accountID);
    }
    if (checkString(category)) {
      return await incomeService.getByCategory(category);
    }
    if (checkString(accountID)) {
      return await incomeService.getByAccount(accountID);
    }
    return await incomeService.getAllWithoutTransfer();
  } catch (err) {
    toast.error("Failed to load incomes");
    console.error(err);
    return [];
  }
};

export const useIncomes = () => {
  const [filters, setFilters] = createSignal({
    recurringFilter: RECURRING_FILTER_OPTIONS[0].value,
    category: "",
    accountID: "",
    dateRange: { start: "", end: "" },
  });

  const [incomes, { refetch }] = createResource(filters, fetchIncomes);

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

  const create = async (data: Omit<IncomeType, "id" | "createdAt">) => {
    try {
      await incomeService.create(data);
      toast.success("Income created successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to create income");
      throw error;
    }
  };

  const update = async (id: string, data: Partial<IncomeType>) => {
    try {
      await incomeService.update(id, data);
      toast.success("Income updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update income");
      throw error;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await incomeService.delete(id);
      toast.success("Income deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete income");
      throw error;
    }
  };

  return {
    incomes,
    loading: () => !!incomes.loading,
    error: () => incomes.error,
    refresh: refetch,
    create,
    update,
    filter,
    filters,
    filterByDateRange,
    delete: deleteIncome,
  };
};
