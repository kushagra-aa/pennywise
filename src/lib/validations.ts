import { z } from "zod";

export const profileSchema = z.object({
  monthlyIncome: z.number().min(0, "Income must be positive"),
  currency: z.string().min(1, "Currency is required"),
});

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["credit_card", "debit_card", "bank_account"]),
  balance: z.number().optional(),
  creditLimit: z.number().optional(),
  billingCycleStart: z.number().min(1).max(31).optional(),
  billingCycleEnd: z.number().min(1).max(31).optional(),
});

export const expenseSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
});
export const incomeSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
});
export const transferSchema = z.object({
  fromAccountID: z.string().min(1, "From Account is required"),
  toAccountID: z.string().min(1, "To Account is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type AccountFormData = z.infer<typeof accountSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type IncomeFormData = z.infer<typeof incomeSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;

export const recurringCreateSchema = z
  .object({
    dayOfMonth: z.number().min(1).max(31),
    amount: z.number().positive(),
    accountId: z.string().min(1, "Account is required"),
    description: z.string(),
    category: z.string().optional(),
    type: z.enum(["expense", "income", "emi"]),
    // EMI fields (optional but required if type === 'emi')
    totalAmount: z.number().positive().optional(),
    monthlyAmount: z.number().positive().optional(),
    installments: z.number().int().positive().optional(),
    installmentsPaid: z.number().int().min(0).optional(),
    startDate: z.coerce.date<Date>().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "emi") {
      if (!data.totalAmount || data.totalAmount <= 0)
        ctx.addIssue({
          code: "custom",
          message: "EMI requires Total Amount",
          path: ["totalAmount"],
        });
      if (!data.monthlyAmount || data.monthlyAmount <= 0)
        ctx.addIssue({
          code: "custom",
          message: "EMI requires Monthly Amount",
          path: ["monthlyAmount"],
        });
      if (
        data.monthlyAmount &&
        data.totalAmount &&
        data.monthlyAmount > data.totalAmount
      )
        ctx.addIssue({
          code: "custom",
          message: "EMI Monthly Amount can not be greater than Total Amount",
          path: ["monthlyAmount"],
        });
      if (data.monthlyAmount && data.monthlyAmount !== data.amount)
        ctx.addIssue({
          code: "custom",
          message: "EMI Monthly Amount should be equal to Amount",
          path: ["amount"],
        });
      if (!data.installments)
        ctx.addIssue({
          code: "custom",
          message: "EMI requires Installments",
          path: ["installments"],
        });
      if (data.installmentsPaid === undefined)
        ctx.addIssue({
          code: "custom",
          message: "EMI requires Paid Installments count",
          path: ["installmentsPaid"],
        });
      if (
        data.installmentsPaid &&
        data.installments &&
        data.installmentsPaid > data.installments
      )
        ctx.addIssue({
          code: "custom",
          message:
            "EMI Paid Installments can not be greater than Total Installments",
          path: ["installmentsPaid"],
        });
    }
  });

export type RecurringFormData = z.infer<typeof recurringCreateSchema>;
