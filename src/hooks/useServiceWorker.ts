import { createSignal } from "solid-js";
import { registerSW } from "virtual:pwa-register";

export function useServiceWorker() {
  const [needRefresh, setNeedRefresh] = createSignal(false);
  const [offlineReady, setOfflineReady] = createSignal(false);

  const updateSW = registerSW({
    onNeedRefresh() {
      setNeedRefresh(true);
    },
    onOfflineReady() {
      setOfflineReady(true);
    },
  });

  const reloadApp = () => updateSW(true);

  return { needRefresh, offlineReady, reloadApp };
}
