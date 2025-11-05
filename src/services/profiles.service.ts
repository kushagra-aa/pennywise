import { db } from "~/db/schema";
import type { ProfileType } from "~/types";

export const profileService = {
  // Get profile (only one exists)
  get: async (): Promise<ProfileType | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const profiles = await db.profile.toArray();
    return profiles[0] || null;
  },

  // Create or update profile
  save: async (
    data: Omit<ProfileType, "id" | "createdAt" | "updatedAt">,
  ): Promise<void> => {
    const existing = await profileService.get();

    if (existing) {
      await db.profile.update(existing.id, {
        ...data,
        updatedAt: new Date(),
      });
    } else {
      await db.profile.add({
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  },

  // Update specific fields
  update: async (data: Partial<ProfileType>): Promise<void> => {
    const existing = await profileService.get();
    if (existing) {
      await db.profile.update(existing.id, {
        ...data,
        updatedAt: new Date(),
      });
    }
  },

  // Delete profile with all stuff
  clear: async (id: string): Promise<void> => {
    await db.transaction(
      "rw",
      db.profile,
      db.expenses,
      db.accounts,
      async () => {
        await db.expenses.clear();
        await db.accounts.clear();
        await db.profile.delete(id);
      },
    );
  },
};
