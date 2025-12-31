import { useNavigate } from "@solidjs/router";
import { onMount, Show, type Component } from "solid-js";
import UIButton from "~/components/ui/Button";
import { useInstallPrompt } from "~/hooks/useInstallPrompt";
import { useServiceWorker } from "~/hooks/useServiceWorker";
import { isPWAInstalled } from "~/lib/pwa";

const Feature = (props: { title: string }) => (
  <div
    class="
      p-5 rounded-xl
      bg-white/5 backdrop-blur
      border border-white/10
      hover:border-[#646cff]/40
      transition
    "
  >
    <h3 class="text-[#e2d7ff] font-medium">{props.title}</h3>
    <p class="mt-2 text-sm text-gray-400">
      Simple, fast, and designed for daily use.
    </p>
  </div>
);
const Divider = () => (
  <div class="my-2 h-px w-full bg-linear-to-r from-transparent via-[#646cff]/40 to-transparent" />
);

const LandingPage: Component = () => {
  const { needRefresh, reloadApp, offlineReady } = useServiceWorker();
  const { canInstall, promptInstall } = useInstallPrompt();
  const navigate = useNavigate();

  onMount(() => {
    if (isPWAInstalled()) {
      navigate("/transactions");
    }
  });

  return (
    <div class="relative bg-[#06040b] text-[#e2d7ff] min-h-screen">
      <Show when={needRefresh()}>
        <div class="fixed bottom-4 inset-x-0 mx-auto w-fit z-50 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-md text-sm">
          New version available.
          <UIButton
            class="
              px-6 py-3 rounded-full
              bg-[#646cff] text-[#06040b]
              shadow-[0_0_20px_rgba(100,108,255,0.35)]
              hover:shadow-[0_0_30px_rgba(100,108,255,0.55)]
              transition
            "
            onClick={reloadApp}
          >
            Reload
          </UIButton>
        </div>
      </Show>

      <Show when={offlineReady()}>
        <div class="fixed bottom-16 inset-x-0 mx-auto w-fit z-40 bg-green-600 text-white px-3 py-1 rounded-lg shadow-md text-xs opacity-80">
          App ready to work offline
        </div>
      </Show>

      <section class="relative min-h-[90vw] flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-linear-to-b from-[#06040b] to-[#0b0920]">
        <h1 class="text-4xl font-semibold tracking-wide text-[#e2d7ff]">
          PennyWise
        </h1>

        <p class="mt-4 text-lg text-[#646cff]">
          A simple, offline-first expense manager.
        </p>

        <p class="mt-3 max-w-md text-sm text-gray-400">
          Track expenses, incomes, transfers, and recurring payments. No login.
          No cloud. Your data stays on your device.
        </p>
        <div class="mt-12 flex justify-center gap-4 flex-wrap">
          <Show when={canInstall()}>
            <UIButton
              onClick={promptInstall}
              class="
                px-6 py-3 rounded-full
                bg-[#646cff] text-[#06040b]
                shadow-[0_0_20px_rgba(100,108,255,0.35)]
                hover:shadow-[0_0_30px_rgba(100,108,255,0.55)]
                transition
              "
            >
              Install PennyWise
            </UIButton>
          </Show>

          <a
            href="/dashboard"
            class="px-6 py-3 rounded-lg border border-[#646cff] text-[#e2d7ff]"
          >
            Try Online
          </a>
        </div>
      </section>

      <section class="py-16 px-6 text-center">
        <h2 class="text-2xl font-semibold text-[#e2d7ff] relative inline-block">
          What is PennyWise?
          <span class="absolute left-0 -bottom-2 h-0.5 w-1/2 bg-[#646cff]" />
        </h2>
        <p class="mt-4 max-w-xl mx-auto text-gray-400">
          PennyWise is a local-only personal finance app. It runs entirely in
          your browser, works offline, and keeps your data on your device.
          <a href="/guide" class="ml-1 underline! underline-offset-4">
            Learn More
          </a>
        </p>
      </section>
      <Divider />
      <section class="py-16 px-6 text-center">
        <h2 class="text-2xl font-semibold text-[#e2d7ff] relative inline-block">
          Core Features
          <span class="absolute left-0 -bottom-2 h-0.5 w-1/2 bg-[#646cff]" />
        </h2>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          <Feature title="Accounts & Balances" />
          <Feature title="Expenses & Incomes" />
          <Feature title="Transfers Between Accounts" />
          <Feature title="Recurring Transactions & EMIs" />
          <Feature title="Monthly Budget Tracking" />
          <Feature title="Import / Export Your Data" />
        </div>
      </section>
      <Divider />
      <section class="py-16 px-6 text-center bg-linear-to-b from-[#06040b] to-[#0b0920]">
        <h2 class="text-2xl font-semibold text-[#e2d7ff] relative inline-block">
          Offline & Private by Design
          <span class="absolute left-0 -bottom-2 h-0.5 w-1/2 bg-[#646cff]" />
        </h2>
        <p class="mt-4 max-w-xl mx-auto text-gray-400">
          PennyWise stores all data locally using IndexedDB. No accounts. No
          tracking. No servers. Once installed, it works fully offline.
        </p>
      </section>
      <section class="py-20 px-6 text-center">
        <h2 class="text-2xl font-semibold text-[#e2d7ff] relative inline-block">
          Start Using PennyWise
          <span class="absolute left-0 -bottom-2 h-0.5 w-1/2 bg-[#646cff]" />
        </h2>
        <div class="mt-12 flex justify-center gap-4 flex-wrap">
          <Show when={canInstall()}>
            <UIButton
              onClick={promptInstall}
              class="
                px-6 py-3 rounded-full
                bg-[#646cff] text-[#06040b]
                shadow-[0_0_20px_rgba(100,108,255,0.35)]
                hover:shadow-[0_0_30px_rgba(100,108,255,0.55)]
                transition
              "
            >
              Install PennyWise
            </UIButton>
          </Show>

          <a
            href="/dashboard"
            class="px-6 py-3 rounded-lg border border-[#646cff] text-[#e2d7ff]"
          >
            Try Online
          </a>
        </div>
      </section>
      <Divider />
      <section class="py-20 px-6 text-center">
        <p class="text-sm text-[#646cff] uppercase tracking-widest">
          Developed By
        </p>

        <h3 class="mt-3 text-xl font-semibold">
          <a
            class="text-[#e2d7ff]! underline! underline-offset-4!"
            href="https://kushagra-aa.vercel.app/"
            target="_blank"
          >
            Kushagra Agnihotri
          </a>
        </h3>

        <p class="mt-2 text-sm text-gray-400 max-w-md mx-auto">
          PennyWise is a personal project focused on privacy, simplicity, and
          everyday usability.
        </p>
      </section>
      <Divider />
      <footer class="pt-2 pb-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} PennyWise · Local-first personal finance
      </footer>
    </div>
  );
};
export default LandingPage;
