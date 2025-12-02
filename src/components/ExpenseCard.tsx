import { format } from "date-fns";
import { IndianRupee, Pencil, Trash2 } from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import { accounts } from "~/pages/Transactions";
import type { ExpenseType } from "~/types";
import UIButton from "./ui/Button";

const ExpenseCard = ({
  expense,
  currency,
  handleDelete,
  setEditingExpense,
}: {
  expense: ExpenseType;
  currency: string;
  setEditingExpense: (expense: ExpenseType) => void;
  handleDelete: (expenseId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const account = createMemo(() =>
    accounts()?.find((acc) => acc.id === expense.accountId)
  );

  return (
    <div class="bg-slate-900 text-gray-300 border rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow border-red-700">
      {/* Expense Header */}
      <div
        class="flex items-start justify-between mb-3"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <div class="flex items-center gap-3 w-full">
          <div class="p-2 bg-slate-800 rounded-lg text-orange-600">
            <IndianRupee />
          </div>
          <div>
            <h3 class="font-semibold text-lg">
              -{currency}
              {expense.amount}
              {!!expense.recurringId ? "RE" : ""}
              {!!expense.transferID ? "TR" : ""}
            </h3>
            <p class="text-sm text-gray-400 capitalize">
              {format(expense.date!, "PP")}
            </p>
          </div>
          <div class="flex-1 flex flex-col items-end justify-center">
            <span>Account:</span>
            <p class="text-sm text-gray-400 capitalize">{account()?.name}</p>
          </div>
        </div>
      </div>
      <Show when={isExpanded()}>
        {/* Expense Details */}
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Account Type:</span>
            <span class="font-medium capitalize">
              {account()?.type.replace("_", " ")}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Category:</span>
            <span class="font-medium">{expense.category}</span>
          </div>
          <div class="flex flex-col gap-1 text-sm">
            <span class="text-gray-500">Description:</span>
            <span class="font-medium">{expense.description}</span>
          </div>
        </div>

        {/* Actions */}
        <div class="flex gap-2">
          <UIButton
            onClick={() => setEditingExpense(expense)}
            class="bg-gray-600! hover:bg-gray-700! text-sm flex-1 text-slate-300!"
          >
            <Pencil size={16} />
            Edit
          </UIButton>
          <UIButton
            onClick={() => handleDelete(expense.id)}
            class="bg-gray-700! hover:bg-gray-800! text-red-400!"
          >
            <Trash2 size={16} />
            Delete
          </UIButton>
        </div>
      </Show>
    </div>
  );
};

export default ExpenseCard;
