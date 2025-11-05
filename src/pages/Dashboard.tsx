import {
  createMemo,
  For,
  Show,
  type Component,
  type JSXElement,
} from "solid-js";
import Loader from "~/components/ui/Loader";
import { useAccounts } from "~/hooks/useAccounts";
import { useExpenses } from "~/hooks/useExpenses";
import { useProfile } from "~/hooks/useProfiles";

const renderDashboardCard = (
  val: string | number | undefined | null,
  isLoading: boolean,
  fallback?: JSXElement,
) =>
  isLoading ? (
    <span class="text-gray-500">
      <Loader size={20} />
    </span>
  ) : val ? (
    val
  ) : (
    fallback
  );

const Dashboard: Component = () => {
  const { expenses, loading: expensesLoading } = useExpenses();
  const { accounts, loading: accountsLoading } = useAccounts();
  const { profile, loading: profileLoading } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";
  const totalExpenses = createMemo(() =>
    expenses()
      ?.reduce((sum, exp) => sum + exp.amount, 0)
      .toString(),
  );
  const expensesByAccount = createMemo(() =>
    accounts()?.map((account) => ({
      account,
      total: expenses()
        ?.filter((exp) => exp.accountId === account.id)
        .reduce((sum, exp) => sum + exp.amount, 0),
    })),
  );

  return (
    <div class="flex flex-col gap-6 text-xl">
      <p class="flex gap-4 items-end">
        Total Expenses:{" "}
        <span class="font-bold text-base">
          {renderDashboardCard(
            `${currency} ${totalExpenses()}`,
            expensesLoading(),
            "0",
          )}
        </span>
      </p>
      <hr class="w-1/4 mx-auto text-gray-700" />
      <p class="flex gap-4 items-end">
        Monthly Income:{" "}
        <span class="font-bold text-base">
          {renderDashboardCard(
            `${currency} ${profile()?.monthlyIncome}`,
            profileLoading(),
            "No Income",
          )}
        </span>
      </p>
      <hr class="w-1/4 mx-auto text-gray-700" />
      <p class="flex gap-4 items-end">
        Accounts:
        <span class="font-bold text-base">
          {renderDashboardCard(
            `${accounts()?.length}`,
            accountsLoading(),
            "No Accounts",
          )}
        </span>
      </p>
      <hr class="w-1/4 mx-auto text-gray-700" />
      <div class="flex flex-col gap-4 w-full">
        <p class="flex gap-4 items-center border-b border-gray-700 pb-2">
          Expenses:
        </p>
        <Show when={expensesLoading() || accountsLoading()}>
          <span class="text-gray-500 mx-auto">
            <Loader />
          </span>
        </Show>
        <Show when={expensesByAccount()}>
          <For each={expensesByAccount()}>
            {(expense) => (
              <p class="text-base">
                {expense.account.name}:{" "}
                <span class="font-bold">
                  {currency} {expense.total}
                </span>
              </p>
            )}
          </For>
        </Show>
        <Show when={expensesByAccount() && expensesByAccount()!.length <= 0}>
          <span>No Expenses</span>
        </Show>
      </div>
    </div>
  );
};
export default Dashboard;
