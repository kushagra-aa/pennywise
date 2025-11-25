import { format } from "date-fns";
import { ArrowRight, Landmark, Pencil, Trash2 } from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import type { TransferFullType } from "~/hooks/useTransfers";
import { accounts } from "~/pages/Transactions";
import UIButton from "./ui/Button";

const TransferCard = ({
  income,
  currency,
  handleDelete,
  setEditingTransfer,
}: {
  income: TransferFullType;
  currency: string;
  setEditingTransfer: (income: TransferFullType) => void;
  handleDelete: (incomeId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const fromAccount = createMemo(() =>
    accounts()?.find((acc) => acc.id === income.fromAccountID)
  );
  const toAccount = createMemo(() =>
    accounts()?.find((acc) => acc.id === income.toAccountID)
  );

  return (
    <div class="bg-slate-900 text-gray-300 border rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow border-yellow-700">
      {/* Transfer Header */}
      <div
        class="flex items-start justify-between mb-3"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <div class="flex items-center gap-3 w-full">
          <div class="p-2 bg-slate-800 rounded-lg text-yellow-600">
            <Landmark />
          </div>
          <div>
            <h3 class="font-semibold text-lg">
              {currency}
              {income.amount}
            </h3>
            <p class="text-sm text-gray-400 capitalize">
              {format(income.date!, "PP")}
            </p>
          </div>
          <div class="flex-1 flex items-center justify-end gap-2">
            <p class="text-base text-gray-400 capitalize">
              {fromAccount()?.name}
            </p>
            <ArrowRight size={10} />
            <p class="text-base text-gray-400 capitalize">
              {toAccount()?.name}
            </p>
          </div>
        </div>
      </div>

      <Show when={isExpanded()}>
        {/* Transfer Details */}
        <div class="space-y-2 mb-4">
          <div class="flex flex-col gap-1 text-sm">
            <span class="text-gray-500">Description:</span>
            <span class="font-medium">{income.description}</span>
          </div>
        </div>

        {/* Actions */}
        <div class="flex gap-2">
          <UIButton
            onClick={() => setEditingTransfer(income)}
            class="bg-gray-600! hover:bg-gray-700! text-sm flex-1 text-slate-300!"
          >
            <Pencil size={16} />
            Edit
          </UIButton>
          <UIButton
            onClick={() => handleDelete(income.id)}
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

export default TransferCard;
