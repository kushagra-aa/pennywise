import { format } from "date-fns";
import { User, UserCircleIcon } from "lucide-solid";
import { createSignal, Show, type Component } from "solid-js";
import ProfileForm from "~/components/forms/ProfileForm";
import { useProfile } from "~/hooks/useProfiles";
import type { ProfileType } from "~/types";

const Profile: Component = () => {
  const [isModifyingProfile, setIsModifyingProfile] = createSignal(false);

  const { profile, loading, save } = useProfile();

  return (
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Your Profile</h2>
        <button
          onClick={() => setIsModifyingProfile(true)}
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <User size={18} />
          Modify Profile
        </button>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="text-center py-8">
          <p class="text-gray-500">Loading accounts...</p>
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && !profile()}>
        <div class="flex flex-col gap-2 items-center justify-center text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <UserCircleIcon size={48} class="text-gray-400" />
          <h3 class="text-lg font-semibold text-gray-700">No accounts yet</h3>
          <p class="text-gray-500">Get started by adding your first account</p>
          <button
            onClick={() => setIsModifyingProfile(true)}
            class="flex gap-4 items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <User size={16} />
            Modify Profile
          </button>
        </div>
      </Show>
      <Show when={!loading() && profile()}>
        <p class="text-gray-200">
          Total Income:{" "}
          <span class="font-bold">{profile()?.monthlyIncome}</span>
        </p>
        <p class="text-gray-200">
          Currency: <span class="font-bold">{profile()?.currency}</span>
        </p>
        <Show when={profile()?.updatedAt}>
          <p class="text-gray-200">
            Last UpdatedAt:{" "}
            <span class="font-bold">
              {format(profile()?.updatedAt!, "PPpp")}
            </span>
          </p>
        </Show>
      </Show>

      <Show when={isModifyingProfile()}>
        <div
          onClick={() => {
            setIsModifyingProfile(false);
          }}
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            class="bg-white text-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 class="text-xl font-semibold mb-4">{"Add Account"}</h3>
            <ProfileForm
              profile={profile() || undefined}
              onSubmit={async (
                data: Omit<ProfileType, "id" | "createdAt" | "updatedAt">,
              ) => {
                await save(data);

                setIsModifyingProfile(false);
              }}
              onCancel={() => {
                setIsModifyingProfile(false);
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Profile;
