import { Show, type Component, type JSXElement } from "solid-js";
import { A } from "@solidjs/router";
import { Home, CreditCard, Receipt, User } from "lucide-solid";
import { useServiceWorker } from "~/hooks/useServiceWorker";
import { useInstallPrompt } from "~/hooks/useInstallPrompt";

const Layout: Component<{ children?: JSXElement }> = (props) => {
  const { needRefresh, reloadApp, offlineReady } = useServiceWorker();
  const { canInstall, promptInstall } = useInstallPrompt();

  return (
    <div class="min-h-screen bg-background pb-20">
      {/*PWA*/}
      <Show when={needRefresh()}>
        <div class="fixed bottom-4 inset-x-0 mx-auto w-fit bg-slate-800 text-white px-4 py-2 rounded-lg shadow-md">
          New version available.{" "}
          <button class="underline" onClick={reloadApp}>
            Reload
          </button>
        </div>
      </Show>
      <Show when={offlineReady()}>
        <div class="fixed bottom-16 inset-x-0 mx-auto w-fit bg-green-600 text-white px-2 py-1 rounded-lg shadow-md z-200 text-xs">
          App ready to work offline
        </div>
      </Show>

      {/* Header */}
      <header class="sticky top-0 z-10 bg-background border-b border-border w-screen">
        <div class="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 class="text-lg font-bold">PennyWise</h1>
          <Show when={canInstall()}>
            <button
              onClick={promptInstall}
              class="w-max bg-indigo-600 text-white text-xs rounded-lg py-1 px-4 shadow-sm cursor-pointer"
            >
              Install PennyWise
            </button>
          </Show>
        </div>
      </header>

      {/* Main Content */}
      <main class="container mx-auto px-4 py-6">{props.children}</main>

      {/* Bottom Navigation */}
      <nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div class="container mx-auto px-4">
          <div class="flex justify-around py-3">
            <A
              href="/"
              class="flex flex-col items-center gap-1 text-sm"
              activeClass="text-foreground font-semibold"
              inactiveClass="text-foreground/60"
            >
              <Home size={24} />
              <span>Home</span>
            </A>
            <A
              href="/accounts"
              class="flex flex-col items-center gap-1 text-sm"
              activeClass="text-foreground font-semibold"
              inactiveClass="text-foreground/60"
            >
              <CreditCard size={24} />
              <span>Accounts</span>
            </A>
            <A
              href="/expenses"
              class="flex flex-col items-center gap-1 text-sm"
              activeClass="text-foreground font-semibold"
              inactiveClass="text-foreground/60"
            >
              <Receipt size={24} />
              <span>Expenses</span>
            </A>
            <A
              href="/profile"
              class="flex flex-col items-center gap-1 text-sm"
              activeClass="text-foreground font-semibold"
              inactiveClass="text-foreground/60"
            >
              <User size={24} />
              <span>Profile</span>
            </A>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
