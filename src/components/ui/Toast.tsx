import {
  Toast as KobalteToast,
  toaster,
  Region,
  Root,
  List,
} from "@kobalte/core/toast";
import { type Component, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { X, CheckCircle, AlertCircle, Info } from "lucide-solid";
import { cn } from "~/lib/utils";

// Toast variant type
export type ToastVariant = "success" | "error" | "info" | "loading";

// Individual toast message component
interface ToastMessageProps {
  toastId: number;
  variant?: ToastVariant;
  children: JSX.Element;
}

const ToastMessage: Component<ToastMessageProps> = (props) => {
  const variantStyles = {
    success: "bg-green-50 border-green-200 text-green-900",
    error: "bg-red-50 border-red-200 text-red-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
    loading: "bg-gray-50 border-gray-200 text-gray-900",
  };

  const Icon = () => {
    switch (props.variant) {
      case "success":
        return CheckCircle;
      case "error":
        return AlertCircle;
      case "loading":
        return Info;
      default:
        return Info;
    }
  };

  const IconComponent = Icon();

  return (
    <Root
      toastId={props.toastId}
      class={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[320px]",
        "animate-in slide-in-from-top-full duration-200",
        "`data-[swipe=move]:translate-x-(--kb-toast-swipe-move-x)",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform",
        "data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full",
        "data-closed:animate-out data-[closed]:fade-out-80 data-[closed]:slide-out-to-right-full",
        variantStyles[props.variant || "info"],
      )}
    >
      <IconComponent size={20} class="shrink-0 mt-0.5" />

      <div class="flex-1 text-sm">{props.children}</div>

      <KobalteToast.CloseButton class="shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors">
        <X size={16} />
      </KobalteToast.CloseButton>
    </Root>
  );
};

// Toast functions
function show(message: string) {
  return toaster.show((props) => (
    <ToastMessage toastId={props.toastId} variant="info">
      {message}
    </ToastMessage>
  ));
}

function success(message: string) {
  return toaster.show((props) => (
    <ToastMessage toastId={props.toastId} variant="success">
      {message}
    </ToastMessage>
  ));
}

function error(message: string) {
  return toaster.show((props) => (
    <ToastMessage toastId={props.toastId} variant="error">
      {message}
    </ToastMessage>
  ));
}

function info(message: string) {
  return toaster.show((props) => (
    <ToastMessage toastId={props.toastId} variant="info">
      {message}
    </ToastMessage>
  ));
}

// Fixed promise function with proper typing
function promise<T, U = Error>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  options: {
    loading?: JSX.Element;
    success?: (data: T) => JSX.Element;
    error?: (error: U) => JSX.Element;
  },
) {
  return toaster.promise(promiseOrFn, (props) => {
    // Type guard to check which state we're in
    const getContent = () => {
      if (props.state === "pending") {
        return options.loading || "Loading...";
      }
      if (props.state === "fulfilled") {
        // TypeScript now knows props.data exists here
        return options.success?.(props.data as T) || "Success!";
      }
      if (props.state === "rejected") {
        // TypeScript now knows props.error exists here
        return options.error?.(props.error as U) || "Error occurred";
      }
      return null;
    };

    const getVariant = (): ToastVariant => {
      if (props.state === "pending") return "loading";
      if (props.state === "fulfilled") return "success";
      return "error";
    };

    return (
      <ToastMessage toastId={props.toastId} variant={getVariant()}>
        {getContent()}
      </ToastMessage>
    );
  });
}

function custom(jsx: () => JSX.Element) {
  return toaster.show((props) => <Root toastId={props.toastId}>{jsx()}</Root>);
}

function dismiss(id: number) {
  return toaster.dismiss(id);
}

// Export toast object
export const toast = {
  show,
  success,
  error,
  info,
  promise,
  custom,
  dismiss,
};

// Toast Provider Component
const Toast: Component = () => {
  return (
    <Portal>
      <Region>
        <List class="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 w-full max-w-md" />
      </Region>
    </Portal>
  );
};

export default Toast;
