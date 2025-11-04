import { createResource } from "solid-js";
import { toast } from "~/components/ui/Toast";
import { accountService } from "~/services/accounts.service";
import type { AccountType } from "~/types";

export const useAccounts = () => {
  const [accounts, { refetch }] = createResource(async () => {
    try {
      return await accountService.getAll();
    } catch (error) {
      toast.error("Failed to load accounts");
      console.error(error);
      return [];
    }
  });

  const refresh = () => refetch();

  const create = async (data: Omit<AccountType, "id" | "createdAt">) => {
    try {
      await accountService.create(data);
      toast.success("Account created successfully");
      refresh();
    } catch (error) {
      toast.error("Failed to create account");
      throw error;
    }
  };

  const update = async (id: string, data: Partial<AccountType>) => {
    try {
      await accountService.update(id, data);
      toast.success("Account updated successfully");
      refresh();
    } catch (error) {
      toast.error("Failed to update account");
      throw error;
    }
  };

  const deleteAccount = async (id: string, withExpenses: boolean = false) => {
    try {
      if (withExpenses) {
        await accountService.deleteWithExpenses(id);
        toast.success("Account and expenses deleted");
      } else {
        await accountService.delete(id);
        toast.success("Account deleted");
      }
      refresh();
    } catch (error) {
      toast.error("Failed to delete account");
      throw error;
    }
  };

  return {
    accounts,
    loading: () => !!accounts.loading,
    error: () => accounts.error,
    refresh,
    create,
    update,
    delete: deleteAccount,
  };
};
