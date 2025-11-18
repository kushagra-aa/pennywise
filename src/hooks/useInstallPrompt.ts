import { createSignal, onCleanup, onMount } from "solid-js";

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = createSignal(false);
  let deferredPrompt: any = null;

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      console.log("PennyWise installed!");
    }
    deferredPrompt = null;
    setCanInstall(false);
  };

  onMount(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    onCleanup(() => window.removeEventListener("beforeinstallprompt", handler));
  });

  return { canInstall, promptInstall };
}
