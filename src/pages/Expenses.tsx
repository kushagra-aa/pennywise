import { CreditCard, Plus } from "lucide-solid";
import { type Component, For, Show, createSignal } from "solid-js";
import ExpenseCard from "~/components/ExpenseCard";
import ExpenseForm from "~/components/forms/ExpenseForm";
import { useAccounts } from "~/hooks/useAccounts";
import { useExpenses } from "~/hooks/useExpenses";
import { useProfile } from "~/hooks/useProfiles";
import type { ExpenseType } from "~/types";

export const ExpenseCategories = [
  { value: "shopping", label: "Shopping" },
] as const;

export const { accounts } = useAccounts();

const Expenses: Component = () => {
  const {
    expenses,
    loading,
    create,
    update,
    delete: deleteExpense,
  } = useExpenses();
  const { profile } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  const [isAddingExpense, setIsAddingExpense] = createSignal(false);
  const [editingExpense, setEditingExpense] = createSignal<ExpenseType | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      await deleteExpense(id);
    }
  };

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Expenses</h2>
        <button
          onClick={() => setIsAddingExpense(true)}
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="text-center py-8">
          <p class="text-gray-500">Loading expenses...</p>
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && expenses()?.length === 0}>
        <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <CreditCard size={48} class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-700 mb-2">
            No expenses yet
          </h3>
          <p class="text-gray-500 mb-4">
            Get started by adding your first expense
          </p>
          <button
            onClick={() => setIsAddingExpense(true)}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Expense
          </button>
        </div>
      </Show>

      {/* Expenses List */}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <For each={expenses()}>
          {(expense) => (
            <ExpenseCard
              expense={expense}
              currency={currency}
              handleDelete={handleDelete}
              setEditingExpense={setEditingExpense}
            />
          )}
        </For>
      </div>

      <Show when={isAddingExpense() || editingExpense()}>
        <div
          onClick={() => {
            setIsAddingExpense(false);
            setEditingExpense(null);
          }}
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="bg-white text-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 class="text-xl font-semibold mb-4">
              {editingExpense() ? "Edit Expense" : "Add Expense"}
            </h3>
            <ExpenseForm
              expense={editingExpense() || undefined}
              onSubmit={async (data: Omit<ExpenseType, "id" | "createdAt">) => {
                if (editingExpense()) {
                  await update(editingExpense()!.id, data);
                } else {
                  await create(data);
                }
                setIsAddingExpense(false);
                setEditingExpense(null);
              }}
              onCancel={() => {
                setIsAddingExpense(false);
                setEditingExpense(null);
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Expenses;
