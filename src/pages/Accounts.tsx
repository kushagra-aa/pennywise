import { useNavigate } from "@solidjs/router";
import { CreditCard, SettingsIcon } from "lucide-solid";
import { type Component, For, Show, createMemo, createSignal } from "solid-js";
import AccountCard from "~/components/AccountCard";
import EmptyState from "~/components/EmptyState";
import AddButton from "~/components/FloatingButtons/AddButton";
import MenuButton from "~/components/FloatingButtons/MenuButton";
import AccountForm from "~/components/forms/AccountForm";
import Modal from "~/components/Modal";
import UIButton from "~/components/ui/Button";
import Loader from "~/components/ui/Loader";
import { useAccounts } from "~/hooks/useAccounts";
import { useProfile } from "~/hooks/useProfiles";
import type { AccountType } from "~/types";

export const AccountTypes = [
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
  const navigate = useNavigate();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  const [isAddingAccount, setIsAddingAccount] = createSignal(false);
  const [editingAccount, setEditingAccount] = createSignal<AccountType | null>(
    null
  );

  const isModalOpen = createMemo(
    () => !!(isAddingAccount() || editingAccount())
  );

  const handleModalClose = () => {
    setIsAddingAccount(false);
    setEditingAccount(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteAccount(id);
    }
  };
  const onSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div class="space-y-4">
      <MenuButton
        position="bottom-right"
        items={[
          { label: "Settings", icon: SettingsIcon, onClick: onSettingsClick },
          // { label: "Sort", icon: SortAscIcon, onClick() {} },
          // { label: "Filter", icon: FilterIcon, onClick() {} },
        ]}
      />
      <AddButton handleClick={() => setIsAddingAccount(true)} />
      {/* Header */}
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Accounts</h2>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex justify-center text-purple-500 items-center py-8">
          <Loader size={42} />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && accounts()?.length === 0}>
        <EmptyState
          title="No accounts yet"
          text="Get started by adding your first account"
          action={
            <UIButton onClick={() => setIsAddingAccount(true)} class="">
              Add Account
            </UIButton>
          }
          icon={<CreditCard size={48} class="mx-auto text-gray-400" />}
        />
      </Show>

      {/* Accounts List */}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <For each={accounts()}>
          {(account) => (
            <AccountCard
              account={account}
              currency={currency}
              setEditingAccount={setEditingAccount}
              handleDelete={handleDelete}
            />
          )}
        </For>
      </div>

      <Modal
        isOpen={isModalOpen}
        handleClose={handleModalClose}
        title={editingAccount() ? "Edit Account" : "Add Account"}
      >
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
      </Modal>
    </div>
  );
};

export default Accounts;
