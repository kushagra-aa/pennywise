import { CreditCard, Plus } from "lucide-solid";
import { For, Show, createSignal, type Component } from "solid-js";
import EmptyState from "~/components/EmptyState";
import ExpenseCard from "~/components/ExpenseCard";
import IncomeCard from "~/components/IncomeCard";
import TransactionForm from "~/components/TransactionForm";
import UIButton from "~/components/ui/Button";
import Loader from "~/components/ui/Loader";
import { useAccounts } from "~/hooks/useAccounts";
import { useProfile } from "~/hooks/useProfiles";
import {
  useTransactions,
  type TransactionEntity,
  type TransactionKind,
} from "~/hooks/useTransactions";
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
    delete: deleteTransaction,
  } = useTransactions();
  const { profile } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  const [isAddingTransaction, setIsAddingTransaction] = createSignal(false);
  const [editingTransaction, setEditingTransaction] =
    createSignal<TransactionEntity | null>(null);

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Transactions</h2>
        <UIButton onClick={() => setIsAddingTransaction(true)} class="">
          <Plus size={18} />
          Add Transaction
        </UIButton>
      </div>

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
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            </>
          )}
        </For>
      </div>

      <Show when={isAddingTransaction() || editingTransaction()}>
        <div
          onClick={() => {
            setIsAddingTransaction(false);
            setEditingTransaction(null);
          }}
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="bg-white text-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 class="text-xl font-semibold mb-4">
              {editingTransaction() ? "Edit Transaction" : "Add Transaction"}
            </h3>
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
              handleCancel={() => {
                setIsAddingTransaction(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Transactions;
