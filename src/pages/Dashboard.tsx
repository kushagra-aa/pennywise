import { createResource, type Component } from "solid-js";
import { db } from "~/db/schema";

const Dashboard: Component = () => {
  const [stats] = createResource(async () => {
    const [accounts, expenses, profile] = await Promise.all([
      db.accounts.toArray(),
      db.expenses.toArray(),
      db.profile.toArray(),
    ]);

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
      monthlyIncome: profile[0]?.monthlyIncome || 0,
      expensesByAccount,
    };
  });

  return (
    <div>
      {stats() && (
        <>
          <p>Total Expenses: ${stats()!.totalExpenses}</p>
          <p>Monthly Income: ${stats()!.monthlyIncome}</p>
          <p>Accounts: {stats()!.totalAccounts}</p>
        </>
      )}
    </div>
  );
};
export default Dashboard;
