import { createForm } from "@tanstack/solid-form";
import { format } from "date-fns";
import { createMemo, For, Show, type Component } from "solid-js";
import {
  recurringCreateSchema,
  type RecurringFormData,
} from "~/lib/validations";
import { accounts, RecurringTypes } from "~/pages/Recurrings";
import { ExpenseCategories } from "~/pages/Transactions";
import type { AccountType, RecurringType } from "~/types";
import UIButton from "../ui/Button";

interface RecurringFormProps {
  recurring?: RecurringType;
  onSubmit: (data: RecurringFormData) => Promise<void>;
  onCancel: () => void;
}

const RecurringForm: Component<RecurringFormProps> = (props) => {
  const form = createForm(() => ({
    validators: {
      onChange: recurringCreateSchema,
      onSubmit: recurringCreateSchema,
      onSubmitAsync: recurringCreateSchema,
      // onMount: recurringCreateSchema,
    },
    defaultValues: {
      type: props.recurring?.type || "emi",
      description: props.recurring?.description || "",
      dayOfMonth: props.recurring?.dayOfMonth || 10,
      accountId: props.recurring?.accountId || "",
      amount: props.recurring?.amount || 0,
      category: props.recurring?.category || ExpenseCategories[0].value,
      totalAmount: props.recurring?.totalAmount,
      monthlyAmount: props.recurring?.monthlyAmount,
      installments: props.recurring?.installments,
      installmentsPaid: props.recurring?.installmentsPaid || 0,
      startDate: props.recurring?.startDate || new Date(),
    } as RecurringFormData,
    onSubmit: async ({ value }) => {
      let payload = { ...value };
      // ? Parse data based on Type
      if (value.type !== "emi") {
        delete payload.installments;
        delete payload.installmentsPaid;
        delete payload.monthlyAmount;
        delete payload.totalAmount;
        delete payload.startDate;
      }
      if (value.type === "income") {
        delete payload.category;
      }
      await props.onSubmit(payload);
    },
  }));

  // Create a reactive memo for the recurring type
  const recurringType = form.useStore((state) => state.values.type);
  const isEMI = createMemo(() => recurringType() === "emi");
  const isIncome = createMemo(() => recurringType() === "income");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-4 text-gray-900 h-min overflow-x-scroll"
    >
      {/* Recurring Type */}
      <Show when={!props.recurring}>
        <form.Field name="type">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">
                Recurring Type
              </label>
              <select
                value={field().state.value}
                onChange={(e) =>
                  field().handleChange(e.target.value as RecurringType["type"])
                }
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <For each={RecurringTypes}>
                  {(type: (typeof RecurringTypes)[number]) => (
                    <option value={type.value}>{type.label}</option>
                  )}
                </For>
              </select>
            </div>
          )}
        </form.Field>
      </Show>

      <form.Field name="description">
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

      <form.Field name="dayOfMonth">
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Day of Month</label>
            <input
              type="number"
              step="0.01"
              value={field().state.value || 0}
              onInput={(e) =>
                field().handleChange(parseFloat(e.target.value) || 0)
              }
              required
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

      <form.Field name="accountId">
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Account</label>
            <select
              value={field().state.value}
              onChange={(e) => field().handleChange(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="" disabled selected hidden>
                Select Account
              </option>
              <For each={accounts()}>
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

      <form.Field name="amount">
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
              readOnly={isEMI()}
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      <Show when={!isIncome()}>
        <form.Field name="category">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">Category</label>
              <select
                value={field().state.value}
                onChange={(e) => field().handleChange(e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <For each={ExpenseCategories}>
                  {(type: (typeof ExpenseCategories)[number]) => (
                    <option value={type.value}>{type.label}</option>
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
      </Show>
      <Show when={isEMI()}>
        <form.Field name="totalAmount">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">Total Amount</label>
              <input
                type="number"
                step="0.01"
                value={field().state.value || 0}
                onInput={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  field().handleChange(val);
                }}
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

        <form.Field name="monthlyAmount">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">
                Monthly EMI Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={field().state.value || 0}
                onInput={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  form.setFieldValue("amount", val);
                  field().handleChange(val);
                }}
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

        <form.Field name="installments">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">
                Total Installments Count
              </label>
              <input
                type="number"
                step="0.01"
                value={field().state.value || 0}
                onInput={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  field().handleChange(val);
                }}
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

        <form.Field name="installmentsPaid">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">
                Installments Already Paid
              </label>
              <input
                type="number"
                step="0.01"
                value={field().state.value || 0}
                onInput={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  field().handleChange(val);
                }}
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

        <form.Field name="startDate">
          {(field) => (
            <div>
              <label class="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={
                  field().state.value
                    ? format(field().state.value as Date, "yyyy-MM-dd")
                    : ""
                }
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
      </Show>
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
            : props.recurring
            ? "Update"
            : "Create"}
        </UIButton>
      </div>
    </form>
  );
};

export default RecurringForm;
