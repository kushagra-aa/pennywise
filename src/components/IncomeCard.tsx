import { format } from "date-fns";
import { IndianRupee, Pencil, Trash2 } from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import { accounts } from "~/pages/Transactions";
import type { IncomeType } from "~/types";
import UIButton from "./ui/Button";

const IncomeCard = ({
  income,
  currency,
  handleDelete,
  setEditingIncome,
}: {
  income: IncomeType;
  currency: string;
  setEditingIncome: (income: IncomeType) => void;
  handleDelete: (incomeId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const account = createMemo(() =>
    accounts()?.find((acc) => acc.id === income.accountId)
  );

  return (
    <div class="bg-emerald-100 text-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-lime-400">
      {/* Income Header */}
      <div
        class="flex items-start justify-between mb-3"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <div class="flex items-center gap-3 w-full">
          <div class="p-2 bg-lime-200 rounded-lg text-emerald-600">
            <IndianRupee />
          </div>
          <div>
            <h3 class="font-semibold text-lg">
              {currency}
              {income.amount}
            </h3>
            <p class="text-sm text-gray-500 capitalize">
              {format(income.date!, "PP")}
            </p>
          </div>
          <div class="flex-1 flex flex-col items-end justify-center">
            <span>Account:</span>
            <p class="text-sm text-gray-500 capitalize">{account()?.name}</p>
          </div>
        </div>
      </div>
      <Show when={isExpanded()}>
        {/* Income Details */}
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Account Type:</span>
            <span class="font-medium capitalize">
              {account()?.type.replace("_", " ")}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Category:</span>
            <span class="font-medium">{income.category}</span>
          </div>
          <div class="flex flex-col gap-1 text-sm">
            <span class="text-gray-600">Description:</span>
            <span class="font-medium">{income.description}</span>
          </div>
        </div>

        {/* Actions */}
        <div class="flex gap-2">
          <UIButton
            onClick={() => setEditingIncome(income)}
            class="bg-gray-100! hover:bg-gray-200! text-sm flex-1 text-slate-900!"
          >
            <Pencil size={16} />
            Edit
          </UIButton>
          <UIButton
            onClick={() => handleDelete(income.id)}
            class="bg-red-50! hover:bg-red-100! text-red-600!"
          >
            <Trash2 size={16} />
            Delete
          </UIButton>
        </div>
      </Show>
    </div>
  );
};

export default IncomeCard;
