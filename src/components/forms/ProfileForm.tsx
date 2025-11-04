import { createForm } from "@tanstack/solid-form";
import { Show, type Component } from "solid-js";
import { profileSchema, type ProfileFormData } from "~/lib/validations";
import type { ProfileType } from "~/types";

interface ProfileFormProps {
  profile?: ProfileType;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
}

const ProfileForm: Component<ProfileFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      monthlyIncome: props.profile?.monthlyIncome || 0,
      currency: props.profile?.currency || "₹",
    } as ProfileFormData,
    onSubmit: async ({ value }) => {
      await props.onSubmit(value);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      class="space-y-4 text-gray-900"
    >
      {/* Currency */}
      <form.Field
        name="currency"
        validators={{
          onChange: profileSchema.shape.currency,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Currency</label>
            <input
              type="text"
              value={field().state.value}
              onInput={(e) => field().handleChange(e.target.value)}
              onBlur={() => field().handleBlur()}
              placeholder="e.g., Chase Credit Card"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Monthly Income */}
      <form.Field
        name="monthlyIncome"
        validators={{
          onChange: profileSchema.shape.monthlyIncome,
        }}
      >
        {(field) => (
          <div>
            <label class="block text-sm font-medium mb-1">Monthly Income</label>
            <input
              type="number"
              step="0.01"
              value={field().state.value || 0}
              onInput={(e) =>
                field().handleChange(parseFloat(e.target.value) || 0)
              }
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-red-500 text-sm mt-1">
                {field().state.meta.errors[0]?.message}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Actions */}
      <div class="flex gap-3 pt-4">
        <button
          type="button"
          onClick={props.onCancel}
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={form.state.isSubmitting}
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {form.state.isSubmitting
            ? "Saving..."
            : props.profile
              ? "Update"
              : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
