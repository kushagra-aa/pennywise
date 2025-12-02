import { createMemo, createResource, createSignal } from "solid-js";
import type { ExpenseType, IncomeType } from "~/types";
import { useExpenses } from "./useExpenses";
import { useIncomes } from "./useIncomes";
import { useTransfers, type TransferFullType } from "./useTransfers";

export type TransactionKind = "income" | "expense" | "transfer";
export type TransactionEntity = ExpenseType | IncomeType | TransferFullType;
export type RecurringFilterEnum = "all" | "recurring" | "no_recurring";

export type TransactionType = TransactionEntity & {
  transactionKind: TransactionKind;
};

export const TRANSACTION_TABS: {
  label: string;
  value: TransactionKind | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Expenses", value: "expense" },
  { label: "Incomes", value: "income" },
  { label: "Transfers", value: "transfer" },
];
export const RECURRING_FILTER_OPTIONS: {
  label: string;
  value: RecurringFilterEnum;
}[] = [
  { label: "All", value: "all" },
  { label: "Only Recurring", value: "recurring" },
  { label: "No Recurring", value: "no_recurring" },
];

export const useTransactions = () => {
  const {
    expenses,
    loading: expensesLoading,
    refresh: expensesRefresh,
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
    refresh: incomesRefresh,
    filter: incomeFilter,
    filterByDateRange: incomeFilterByDateRange,
    filters: incomeFilters,
    create: createIncome,
    update: updateIncome,
    delete: deleteIncome,
  } = useIncomes();
  const {
    transfers,
    loading: transfersLoading,
    refresh: transfersRefresh,
    filterByDateRange: transferFilterByDateRange,
    filters: transferFilters,
    create: createTransfer,
    update: updateTransfer,
    delete: deleteTransfer,
  } = useTransfers();

  const [currentTab, setCurrentTab] = createSignal<
    (typeof TRANSACTION_TABS)[number]["value"]
  >(TRANSACTION_TABS[0].value);

  // Normalize: tag each with transactionKind
  const transactionExpenses = createMemo(() =>
    (expenses() || []).map((e) => ({
      ...e,
      transactionKind: "expense" as const,
    }))
  );
  const transactionIncomes = createMemo(() =>
    (incomes() || []).map((e) => ({
      ...e,
      transactionKind: "income" as const,
    }))
  );
  const transactionTransfers = createMemo(() =>
    (transfers() || []).map((e) => ({
      ...e,
      transactionKind: "transfer" as const,
    }))
  );

  const fetchTransactions = async () => {
    // Merge & sort by date (latest first)
    const combined = [
      ...transactionExpenses(),
      ...transactionIncomes(),
      ...transactionTransfers(),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return combined;
  };

  const [transactions, { refetch }] = createResource(
    () => [expenses(), incomes(), transfers()],
    fetchTransactions
  );

  const filter = (rec: RecurringFilterEnum, cat?: string, acc?: string) => {
    incomeFilter(rec, cat, acc);
    expenseFilter(rec, cat, acc);
  };
  const filterByDateRange = (start: string, end: string) => {
    expenseFilterByDateRange(start, end);
    incomeFilterByDateRange(start, end);
    transferFilterByDateRange(start, end);
  };

  const refresh = () => {
    refetch();
    expensesRefresh();
    incomesRefresh();
    transfersRefresh();
  };
  const changeTab = (v: (typeof TRANSACTION_TABS)[number]["value"]) => {
    setCurrentTab(v);
  };

  const create = async (
    data: Omit<TransactionEntity, "id" | "createdAt">,
    type: TransactionKind
  ) => {
    if (type === "expense") await createExpense(data as ExpenseType);
    if (type === "income") await createIncome(data as IncomeType);
    if (type === "transfer") await createTransfer(data as TransferFullType);
  };
  const update = async (
    id: string,
    data: Omit<TransactionEntity, "id" | "createdAt">,
    type: TransactionKind
  ) => {
    if (type === "expense") await updateExpense(id, data as ExpenseType);
    if (type === "income") await updateIncome(id, data as IncomeType);
    if (type === "transfer") await updateTransfer(id, data as TransferFullType);
  };
  const deleteTransaction = async (id: string, type: TransactionKind) => {
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      if (type === "expense") await deleteExpense(id);
      if (type === "income") await deleteIncome(id);
      if (type === "transfer") await deleteTransfer(id);
    }
  };

  const allTransactions = createMemo(() => {
    if (incomeFilters().recurringFilter === "no_recurring") {
      if (currentTab() === "all")
        return [...transactionExpenses(), ...transactionIncomes()];
      if (currentTab() === "expense") return transactionExpenses();
      if (currentTab() === "income") return transactionIncomes();
      if (currentTab() === "transfer") return [];
    }
    if (incomeFilters().recurringFilter === "recurring") {
      if (currentTab() === "all")
        return [...transactionExpenses(), ...transactionIncomes()];
      if (currentTab() === "expense") return transactionExpenses();
      if (currentTab() === "income") return transactionIncomes();
      if (currentTab() === "transfer") return [];
    }
    if (currentTab() === "expense") return transactionExpenses();
    if (currentTab() === "income") return transactionIncomes();
    if (currentTab() === "transfer") return transactionTransfers();
    return transactions();
  });

  return {
    transactions: allTransactions,
    expenses,
    incomes,
    transfers,
    loading: () =>
      !!(expensesLoading() && incomesLoading() && transfersLoading()),
    error: () => transactions.error,
    refresh,
    filter,
    filters: {
      expense: expenseFilters,
      income: incomeFilters,
      transfer: transferFilters,
    },
    filterByDateRange,
    create,
    update,
    delete: deleteTransaction,
    changeTab,
    currentTab,
  };
};
