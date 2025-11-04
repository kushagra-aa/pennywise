import { createResource, createSignal } from "solid-js";
import { profileService } from "~/services/profiles.service";
import { toast } from "~/components/ui/Toast";
import type { ProfileType } from "~/types";

export const useProfile = () => {
  const [trigger, setTrigger] = createSignal(0);

  const [profile, { refetch }] = createResource(trigger, async () => {
    try {
      return await profileService.get();
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
      return null;
    }
  });

  const refresh = () => setTrigger((prev) => prev + 1);

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
