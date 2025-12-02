import { CreditCard, FilterIcon, SettingsIcon } from "lucide-solid";
import { For, Show, createMemo, createSignal, type Component } from "solid-js";
import EmptyState from "~/components/EmptyState";
import ExpenseCard from "~/components/ExpenseCard";
import AddButton from "~/components/FloatingButtons/AddButton";
import MenuButton from "~/components/FloatingButtons/MenuButton";
import IncomeCard from "~/components/IncomeCard";
import Modal from "~/components/Modal";
import OptionsTabs from "~/components/OptionTabs";
import TransactionForm from "~/components/TransactionForm";
import TransferCard from "~/components/TransferCard";
import UIButton from "~/components/ui/Button";
import Loader from "~/components/ui/Loader";
import UITabs from "~/components/ui/Tabs";
import { useAccounts } from "~/hooks/useAccounts";
import { useProfile } from "~/hooks/useProfiles";
import {
  RECURRING_FILTER_OPTIONS,
  TRANSACTION_TABS,
  useTransactions,
  type RecurringFilterEnum,
  type TransactionEntity,
  type TransactionKind,
  type TransactionType,
} from "~/hooks/useTransactions";
import type { TransferFullType } from "~/hooks/useTransfers";
import type { ExpenseType, IncomeType } from "~/types";

export const ExpenseCategories = [
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "entertainment", label: "Entertainment" },
  { value: "bills", label: "Bills" },
  { value: "shopping", label: "Shopping" },
  { value: "health", label: "Health" },
  { value: "others", label: "Others" },
] as const;

export const IncomeCategories = [{ value: "salary", label: "Salary" }] as const;

export const { accounts } = useAccounts();

const Transactions: Component = () => {
  const {
    transactions,
    loading,
    create,
    update,
    changeTab,
    currentTab,
    delete: deleteTransaction,
    filters,
    filter,
  } = useTransactions();
  const { profile } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  const [isAddingTransaction, setIsAddingTransaction] = createSignal(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = createSignal(false);
  const [editingTransaction, setEditingTransaction] =
    createSignal<TransactionType | null>(null);

  const isModalOpen = createMemo(
    () => !!(isAddingTransaction() || editingTransaction())
  );

  const filterRecurring = (val: string) => {
    filter(val as RecurringFilterEnum);
  };
  const handleModalClose = () => {
    setIsAddingTransaction(false);
    setEditingTransaction(null);
    setIsFilterModalOpen(false);
  };
  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const currentRecurringFilter = createMemo(
    () => filters.expense().recurringFilter
  );

  return (
    <div class="space-y-4">
      <MenuButton
        position="bottom-right"
        items={[
          { label: "Settings", icon: SettingsIcon, onClick() {} },
          // { label: "Sort", icon: SortAscIcon, onClick() {} },
          { label: "Filter", icon: FilterIcon, onClick: handleFilterClick },
        ]}
      />
      <AddButton handleClick={() => setIsAddingTransaction(true)} />
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Transactions</h2>
      </div>
      <UITabs
        tabs={TRANSACTION_TABS}
        currentTab={currentTab}
        setCurrentTab={changeTab}
      />

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex justify-center text-purple-500 items-center py-8">
          <Loader size={42} />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && transactions()?.length === 0}>
        <EmptyState
          title="No transactions yet"
          text="Get started by adding your first transaction"
          action={
            <UIButton onClick={() => setIsAddingTransaction(true)} class="">
              Add Transaction
            </UIButton>
          }
          icon={<CreditCard size={48} class="mx-auto text-gray-400" />}
        />
      </Show>

      {/* Transactions List */}
      <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        <For each={transactions()}>
          {(transaction) => (
            <>
              <Show when={transaction.transactionKind === "expense"}>
                <ExpenseCard
                  expense={transaction as ExpenseType}
                  currency={currency}
                  handleDelete={(id: string) =>
                    deleteTransaction(id, transaction.transactionKind)
                  }
                  setEditingExpense={setEditingTransaction}
                />
              </Show>
              <Show when={transaction.transactionKind === "income"}>
                <IncomeCard
                  income={transaction as IncomeType}
                  currency={currency}
                  handleDelete={(id: string) =>
                    deleteTransaction(id, transaction.transactionKind)
                  }
                  setEditingIncome={setEditingTransaction}
                />
              </Show>
              <Show when={transaction.transactionKind === "transfer"}>
                <TransferCard
                  income={transaction as TransferFullType}
                  currency={currency}
                  handleDelete={(id: string) =>
                    deleteTransaction(id, transaction.transactionKind)
                  }
                  setEditingTransfer={setEditingTransaction}
                />
              </Show>
            </>
          )}
        </For>
      </div>

      <Modal
        isOpen={isModalOpen}
        handleClose={handleModalClose}
        title={editingTransaction() ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionForm
          selectedData={editingTransaction}
          handleSubmit={async (
            data: Omit<TransactionEntity, "id" | "createdAt">,
            type: TransactionKind
          ) => {
            if (editingTransaction()) {
              await update(editingTransaction()!.id, data, type);
            } else {
              await create(data, type);
            }
            setIsAddingTransaction(false);
            setEditingTransaction(null);
          }}
          handleCancel={handleModalClose}
        />
      </Modal>
      <Modal
        isOpen={isFilterModalOpen}
        handleClose={handleModalClose}
        title={"Filter Transactions"}
      >
        <OptionsTabs
          title="Filter by Recurring"
          value={currentRecurringFilter}
          handleChange={filterRecurring}
          options={RECURRING_FILTER_OPTIONS}
        />
      </Modal>
    </div>
  );
};

export default Transactions;
