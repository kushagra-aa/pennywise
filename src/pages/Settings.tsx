import { format } from "date-fns";
import { User, UserCircleIcon } from "lucide-solid";
import { createSignal, Show, type Component } from "solid-js";
import EmptyState from "~/components/EmptyState";
import ProfileForm from "~/components/forms/ProfileForm";
import UIButton from "~/components/ui/Button";
import Loader from "~/components/ui/Loader";
import { useProfile } from "~/hooks/useProfiles";
import type { ProfileType } from "~/types";

const Profile: Component = () => {
  const [isModifyingProfile, setIsModifyingProfile] = createSignal(false);

  const { profile, loading, save } = useProfile();

  return (
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Your Profile</h2>
        <UIButton onClick={() => setIsModifyingProfile(true)} class="">
          <User size={16} />
          Modify Profile
        </UIButton>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex justify-center text-purple-500 items-center py-8">
          <Loader size={42} />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && !profile()}>
        <EmptyState
          title="Profile not set yet"
          text="Get started by adding your details"
          action={
            <UIButton onClick={() => setIsModifyingProfile(true)} class="">
              <User size={16} />
              Modify Profile
            </UIButton>
          }
          icon={<UserCircleIcon size={48} class="text-gray-400" />}
        />
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
                data: Omit<ProfileType, "id" | "createdAt" | "updatedAt">
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
