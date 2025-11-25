import { createForm } from "@tanstack/solid-form";
import { format } from "date-fns";
import { createMemo, For, Show, type Component } from "solid-js";
import { transferSchema, type TransferFormData } from "~/lib/validations";
import { accounts } from "~/pages/Transactions";
import type { AccountType, TransferType } from "~/types";
import UIButton from "../ui/Button";

interface TransferFormProps {
  transfer?: TransferType;
  onSubmit: (data: TransferFormData) => Promise<void>;
  onCancel: () => void;
}

const TransferForm: Component<TransferFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      fromAccountID: props.transfer?.fromAccountID || "",
      toAccountID: props.transfer?.toAccountID || "",
      amount: props.transfer?.amount || 0,
      description: props.transfer?.description || "",
      date: props.transfer?.date || new Date(),
    } as TransferFormData,
    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  }));

  const useableAccounts = createMemo(() =>
    accounts()?.filter((a) => a.type === "bank_account")
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-4 text-gray-900"
    >
      <form.Field
        name="amount"
        validators={{
          onChange: transferSchema.shape.amount,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={field().state.value || 0}
              onInput={(e) =>
                field().handleChange(parseFloat(e.target.value) || 0)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      <form.Field
        name="description"
        validators={{
          onChange: transferSchema.shape.description,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={field().state.value}
              onInput={(e) => field().handleChange(e.target.value)}
              onBlur={() => field().handleBlur()}
              placeholder="e.g., Amazon: Portable Monitor"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      <Show when={!props.transfer}>
        <>
          <form.Field
            name="fromAccountID"
            validators={{
              onChange: transferSchema.shape.fromAccountID,
            }}
          >
            {(field) => (
              <div>
                <label class="block text-sm font-medium mb-1">
                  From Account
                </label>
                <select
                  value={field().state.value}
                  onChange={(e) => field().handleChange(e.target.value)}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled selected hidden>
                    Select Account
                  </option>
                  <For each={useableAccounts()}>
                    {(account: AccountType) => (
                      <option value={account.id}>
                        {account.name}-{account.type.replaceAll("_", " ")}
                      </option>
                    )}
                  </For>
                </select>
                <Show when={field().state.meta.errors.length > 0}>
                  <p class="text-red-500 text-sm mt-1">
                    {field().state.meta.errors[0]?.message}
                  </p>
                </Show>
              </div>
            )}
          </form.Field>

          <form.Field
            name="toAccountID"
            validators={{
              onChange: transferSchema.shape.toAccountID,
            }}
          >
            {(field) => (
              <div>
                <label class="block text-sm font-medium mb-1">To Account</label>
                <select
                  value={field().state.value}
                  onChange={(e) => field().handleChange(e.target.value)}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled selected hidden>
                    Select Account
                  </option>
                  <For each={useableAccounts()}>
                    {(account: AccountType) => (
                      <option value={account.id}>
                        {account.name}-{account.type.replaceAll("_", " ")}
                      </option>
                    )}
                  </For>
                </select>
                <Show when={field().state.meta.errors.length > 0}>
                  <p class="text-red-500 text-sm mt-1">
                    {field().state.meta.errors[0]?.message}
                  </p>
                </Show>
              </div>
            )}
          </form.Field>
        </>
      </Show>

      <form.Field
        name="date"
        validators={{
          onChange: transferSchema.shape.date,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={format(field().state.value, "yyyy-MM-dd")}
              onInput={(e) => {
                const dString = e.target.value;
                const d = new Date(dString);
                field().handleChange(d);
              }}
              onBlur={() => field().handleBlur()}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Actions */}
      <div class="flex gap-3 pt-4">
        <UIButton
          type="button"
          onClick={props.onCancel}
          class="w-full items-center justify-center bg-slate-500!"
        >
          Cancel
        </UIButton>
        <UIButton
          type="submit"
          disabled={form.state.isSubmitting}
          class="disabled:opacity-50 disabled:cursor-not-allowed w-full items-center justify-center"
        >
          {form.state.isSubmitting
            ? "Saving..."
            : props.transfer
            ? "Update"
            : "Create"}
        </UIButton>
      </div>
    </form>
  );
};

export default TransferForm;
