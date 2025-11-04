import { createForm } from "@tanstack/solid-form";
import { For, Show, createMemo, type Component } from "solid-js";
import { accountSchema, type AccountFormData } from "~/lib/validations";
import { AcountTypes } from "~/pages/Accounts";
import type { AccountType } from "~/types";

interface AccountFormProps {
  account?: AccountType;
  onSubmit: (data: AccountFormData) => Promise<void>;
  onCancel: () => void;
}

const AccountForm: Component<AccountFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      name: props.account?.name || "",
      type: props.account?.type || "debit_card",
      balance: props.account?.balance || 0,
      creditLimit: props.account?.creditLimit || undefined,
      billingCycleStart: props.account?.billingCycleStart || undefined,
      billingCycleEnd: props.account?.billingCycleEnd || undefined,
    } as AccountFormData,
    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  }));

  // Create a reactive memo for the account type
  const accountType = form.useStore((state) => state.values.type);
  const isCreditCard = createMemo(() => accountType() === "credit_card");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-4 text-gray-900"
    >
      {/* Account Name */}
      <form.Field
        name="name"
        validators={{
          onChange: accountSchema.shape.name,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Account Name</label>
            <input
              type="text"
              value={field().state.value}
              onInput={(e) => field().handleChange(e.target.value)}
              onBlur={() => field().handleBlur()}
              placeholder="e.g., Chase Credit Card"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.toString()}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Account Type */}
      <form.Field
        name="type"
        validators={{
          onChange: accountSchema.shape.type,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Account Type</label>
            <select
              value={field().state.value}
              onChange={(e) =>
                field().handleChange(e.target.value as AccountType["type"])
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <For each={AcountTypes}>
                {(type: (typeof AcountTypes)[number]) => (
                  <option value={type.value}>{type.label}</option>
                )}
              </For>
            </select>
          </div>
        )}
      </form.Field>

      {/* Balance (for debit/bank) */}
      <Show when={!isCreditCard()}>
        <form.Field name="balance">
          {(field) => (
            <Show when={form.state.values.type !== "credit_card"}>
              <div>
                <label class="block text-sm font-medium mb-1">Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={field().state.value || 0}
                  onInput={(e) =>
                    field().handleChange(parseFloat(e.target.value) || 0)
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </Show>
          )}
        </form.Field>
      </Show>

      {/* Credit Limit (for credit cards) */}
      <Show when={isCreditCard()}>
        <form.Field name="creditLimit">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">Credit Limit</label>
              <input
                type="number"
                step="0.01"
                value={field().state.value || 0}
                onInput={(e) =>
                  field().handleChange(parseFloat(e.target.value) || undefined)
                }
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </form.Field>
      </Show>
      {/* Billing Cycle (for credit cards) */}
      <Show when={isCreditCard()}>
        <div class="grid grid-cols-2 gap-4">
          <form.Field name="billingCycleStart">
            {(field) => (
              <div>
                <label class="block text-sm font-medium mb-1">
                  Cycle Start
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={field().state.value || ""}
                  onInput={(e) =>
                    field().handleChange(parseInt(e.target.value) || undefined)
                  }
                  placeholder="Day"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="billingCycleEnd">
            {(field) => (
              <div>
                <label class="block text-sm font-medium mb-1">Cycle End</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={field().state.value || ""}
                  onInput={(e) =>
                    field().handleChange(parseInt(e.target.value) || undefined)
                  }
                  placeholder="Day"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </form.Field>
        </div>
      </Show>

      {/* Actions */}
      <div class="flex gap-3 pt-4">
        <button
          type="button"
          onClick={props.onCancel}
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={form.state.isSubmitting}
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {form.state.isSubmitting
            ? "Saving..."
            : props.account
              ? "Update"
              : "Create"}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
