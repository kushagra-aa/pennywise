import { createResource } from "solid-js";
import { toast } from "~/components/ui/Toast";
import { profileService } from "~/services/profiles.service";
import type { ProfileType } from "~/types";

export const useProfile = () => {
  const [profile, { refetch }] = createResource(async () => {
    try {
      return await profileService.get();
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
      return null;
    }
  });

  const refresh = () => refetch();

  const save = async (
    data: Omit<ProfileType, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      await profileService.save(data);
      toast.success("Profile Saved successfully");
      refresh();
    } catch (error) {
      toast.error("Failed to create account");
      throw error;
    }
  };

  const clearProfile = async (id: string) => {
    try {
      await profileService.clear(id);
      toast.success("Profile Cleared, Everything deleted");
      refresh();
    } catch (error) {
      toast.error("Failed to delete profile");
      throw error;
    }
  };

  return {
    profile,
    loading: () => !!profile.loading,
    error: () => profile.error,
    refresh,
    save,
    clear: clearProfile,
  };
};
