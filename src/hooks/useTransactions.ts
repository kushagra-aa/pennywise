import { createResource } from "solid-js";
import type { ExpenseType, IncomeType } from "~/types";
import { useExpenses } from "./useExpenses";
import { useIncomes } from "./useIncomes";

export type TransactionKind = "income" | "expense";
export type TransactionEntity = ExpenseType | IncomeType;

export type TransactionType = TransactionEntity & {
  transactionKind: TransactionKind;
};

export const useTransactions = () => {
  const {
    expenses,
    loading: expensesLoading,
    filter: expenseFilter,
    filterByDateRange: expenseFilterByDateRange,
    filters: expenseFilters,
    create: createExpense,
    update: updateExpense,
    delete: deleteExpense,
  } = useExpenses();
  const {
    incomes,
    loading: incomesLoading,
    filter: incomeFilter,
    filterByDateRange: incomeFilterByDateRange,
    filters: incomeFilters,
    create: createIncome,
    update: updateIncome,
    delete: deleteIncome,
  } = useIncomes();
  const fetchTransactions = async () => {
    const exp = expenses() ?? [];
    const inc = incomes() ?? [];

    // Normalize: tag each with transactionKind
    const taggedExp = exp.map((e) => ({
      ...e,
      transactionKind: "expense" as const,
    }));
    const taggedInc = inc.map((i) => ({
      ...i,
      transactionKind: "income" as const,
    }));

    // Merge & sort by date (latest first)
    const combined = [...taggedExp, ...taggedInc].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return combined;
  };

  const [transactions, { refetch }] = createResource(
    () => [expenses(), incomes()],
    fetchTransactions
  );

  const filter = (cat?: string, acc?: string) => {
    incomeFilter(cat, acc);
    expenseFilter(cat, acc);
  };
  const filterByDateRange = (start: string, end: string) => {
    expenseFilterByDateRange(start, end);
    incomeFilterByDateRange(start, end);
  };

  const create = async (
    data: Omit<TransactionEntity, "id" | "createdAt">,
    type: TransactionKind
  ) => {
    if (type === "expense") await createExpense(data as ExpenseType);
    if (type === "income") await createIncome(data as IncomeType);
  };
  const update = async (
    id: string,
    data: Omit<TransactionEntity, "id" | "createdAt">,
    type: TransactionKind
  ) => {
    if (type === "expense") await updateExpense(id, data as ExpenseType);
    if (type === "income") await updateIncome(id, data as IncomeType);
  };
  const deleteTransaction = async (id: string, type: TransactionKind) => {
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      if (type === "expense") await deleteExpense(id);
      if (type === "income") await deleteIncome(id);
    }
  };

  return {
    transactions,
    expenses,
    incomes,
    loading: () => !!(expensesLoading() && incomesLoading()),
    error: () => transactions.error,
    refresh: refetch,
    filter,
    filters: { expense: expenseFilters, income: incomeFilters },
    filterByDateRange,
    create,
    update,
    delete: deleteTransaction,
  };
};
