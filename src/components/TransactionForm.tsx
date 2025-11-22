import { createSignal, type Accessor } from "solid-js";
import type {
  TransactionEntity,
  TransactionKind,
} from "~/hooks/useTransactions";
import type { ExpenseType, IncomeType } from "~/types";
import ExpenseForm from "./forms/ExpenseForm";
import IncomeForm from "./forms/IncomeForm";
import UITabs from "./ui/Tabs";

const TRANSACTION_FORMS: TransactionKind[] = ["expense", "income"];

const TransactionForm = ({
  selectedData,
  handleSubmit,
  handleCancel,
}: {
  selectedData: Accessor<TransactionEntity | null>;
  handleSubmit: (
    data: Omit<TransactionEntity, "id" | "createdAt">,
    type: TransactionKind
  ) => Promise<void>;
  handleCancel: () => void;
}) => {
  const [currentForm, setCurrentForm] = createSignal<TransactionKind>(
    TRANSACTION_FORMS[0]
  );
  return (
    <>
      <UITabs
        tabs={[
          {
            // expense
            label: TRANSACTION_FORMS[0],
            value: TRANSACTION_FORMS[0],
            content: (
              <ExpenseForm
                expense={(selectedData() as ExpenseType) ?? undefined}
                onSubmit={(d) => handleSubmit(d, TRANSACTION_FORMS[0])}
                onCancel={handleCancel}
              />
            ),
          },
          {
            // income
            label: TRANSACTION_FORMS[1],
            value: TRANSACTION_FORMS[1],
            content: (
              <IncomeForm
                income={(selectedData() as IncomeType) ?? undefined}
                onSubmit={(d) => handleSubmit(d, TRANSACTION_FORMS[1])}
                onCancel={handleCancel}
              />
            ),
          },
        ]}
        currentTab={currentForm}
        setCurrentTab={setCurrentForm}
      />
    </>
  );
};

export default TransactionForm;
