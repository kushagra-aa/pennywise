/// <reference types="vite/client" />

// Let TS know about vite-plugin-pwa virtual modules:
declare module "virtual:pwa-register" {
  export function registerSW(options?: {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }): (reloadPage?: boolean) => Promise<void>;
}

declare module "virtual:pwa-register/react";
