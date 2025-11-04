import { createResource, type Component } from "solid-js";
import { db } from "~/db/schema";
import { useProfile } from "~/hooks/useProfiles";

const Dashboard: Component = () => {
  const [stats] = createResource(async () => {
    const [accounts, expenses] = await Promise.all([
      db.accounts.toArray(),
      db.expenses.toArray(),
    ]);
    const { profile } = useProfile();

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const expensesByAccount = accounts.map((account) => ({
      account,
      total: expenses
        .filter((exp) => exp.accountId === account.id)
        .reduce((sum, exp) => sum + exp.amount, 0),
    }));

    return {
      totalAccounts: accounts.length,
      totalExpenses,
      monthlyIncome: profile()?.monthlyIncome || 0,
      expensesByAccount,
    };
  });

  const { profile } = useProfile();

  const userProfile = profile();
  const currency = userProfile?.currency || "₹";

  return (
    <div>
      {stats() && (
        <>
          <p>
            Total Expenses: {currency}
            {stats()!.totalExpenses}
          </p>
          <p>
            Monthly Income: {currency}
            {stats()!.monthlyIncome}
          </p>
          <p>Accounts: {stats()!.totalAccounts}</p>
        </>
      )}
    </div>
  );
};
export default Dashboard;
