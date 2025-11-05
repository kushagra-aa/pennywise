import { type Component, Show, For, createSignal } from "solid-js";
import { useAccounts } from "~/hooks/useAccounts";
import { Plus, CreditCard, Trash2, Pencil, PiggyBank } from "lucide-solid";
import type { AccountType } from "~/types";
import AccountForm from "~/components/forms/AccountForm";
import { useProfile } from "~/hooks/useProfiles";
import Loader from "~/components/ui/Loader";

export const AcountTypes = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_account", label: "Bank Account" },
] as const;

const Accounts: Component = () => {
  const {
    accounts,
    loading,
    create,
    update,
    delete: deleteAccount,
  } = useAccounts();
  const { profile } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  const [isAddingAccount, setIsAddingAccount] = createSignal(false);
  const [editingAccount, setEditingAccount] = createSignal<AccountType | null>(
    null,
  );

  const getAccountIcon = (type: AccountType["type"]) => {
    return type === "bank_account" ? (
      <PiggyBank size={24} />
    ) : (
      <CreditCard size={24} />
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteAccount(id);
    }
  };

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Accounts</h2>
        <button
          onClick={() => setIsAddingAccount(true)}
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Account
        </button>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex justify-center text-blue-500 items-center py-8">
          <Loader size={42} />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && accounts()?.length === 0}>
        <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <CreditCard size={48} class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-700 mb-2">
            No accounts yet
          </h3>
          <p class="text-gray-500 mb-4">
            Get started by adding your first account
          </p>
          <button
            onClick={() => setIsAddingAccount(true)}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Account
          </button>
        </div>
      </Show>

      {/* Accounts List */}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <For each={accounts()}>
          {(account) => (
            <div class="bg-white text-gray-800 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Account Header */}
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg">{account.name}</h3>
                    <p class="text-sm text-gray-500 capitalize">
                      {account.type.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div class="space-y-2 mb-4">
                <Show
                  when={account.type === "credit_card" && account.creditLimit}
                >
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Credit Limit:</span>
                    <span class="font-medium">
                      {currency}
                      {account.creditLimit?.toFixed(2)}
                    </span>
                  </div>
                </Show>

                <Show when={account.balance !== undefined}>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Balance:</span>
                    <span class="font-medium">
                      {currency}
                      {account.balance?.toFixed(2)}
                    </span>
                  </div>
                </Show>

                <Show
                  when={account.billingCycleStart && account.billingCycleEnd}
                >
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Billing Cycle:</span>
                    <span class="font-medium">
                      {account.billingCycleStart} - {account.billingCycleEnd}
                    </span>
                  </div>
                </Show>
              </div>

              {/* Actions */}
              <div class="flex gap-2">
                <button
                  onClick={() => setEditingAccount(account)}
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  <Pencil size={16} style={{ transform: "translateY(1px)" }} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(account.id, account.name)}
                  class="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm"
                >
                  <Trash2 size={16} style={{ transform: "translateY(1px)" }} />
                  Delete
                </button>
              </div>
            </div>
          )}
        </For>
      </div>

      <Show when={isAddingAccount() || editingAccount()}>
        <div
          onClick={() => {
            setIsAddingAccount(false);
            setEditingAccount(null);
          }}
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="bg-white text-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 class="text-xl font-semibold mb-4">
              {editingAccount() ? "Edit Account" : "Add Account"}
            </h3>
            <AccountForm
              account={editingAccount() || undefined}
              onSubmit={async (data: Omit<AccountType, "id" | "createdAt">) => {
                if (editingAccount()) {
                  await update(editingAccount()!.id, data);
                } else {
                  await create(data);
                }
                setIsAddingAccount(false);
                setEditingAccount(null);
              }}
              onCancel={() => {
                setIsAddingAccount(false);
                setEditingAccount(null);
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Accounts;
