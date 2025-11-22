import { A } from "@solidjs/router";
import {
  ChartArea,
  CreditCard,
  ReceiptIndianRupee,
  Repeat,
} from "lucide-solid";
import { type Component, type JSXElement } from "solid-js";

const Layout: Component<{ children?: JSXElement }> = (props) => {
  return (
    <div class="min-h-screen bg-background pb-20">
      {/* Header */}
      {/* <header class="sticky top-0 z-10 bg-background border-b border-border w-screen">
        <div class="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 class="text-lg font-bold">PennyWise</h1>
        </div>
      </header> */}

      {/* Main Content */}
      <main class="container mx-auto px-4 py-6 w-screen">{props.children}</main>

      {/* Bottom Navigation */}
      <nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border bg-background z-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-around py-3">
            <A
              href="/dashboard"
              class="flex flex-col items-center gap-1 text-xs"
              activeClass="text-foreground font-semibold"
              inactiveClass="text-foreground/60"
            >
              <ChartArea size={24} />
              <span>Stats</span>
            </A>
            <A
              href="/accounts"
              class="flex flex-col items-center gap-1 text-xs"
              activeClass="text-foreground font-semibold"
              inactiveClass="text-foreground/60"
            >
              <CreditCard size={24} />
              <span>Accounts</span>
            </A>
            <A
              href="/transactions"
              class="flex flex-col items-center gap-1 text-xs"
              activeClass="text-foreground font-semibold"
              inactiveClass="text-foreground/60"
            >
              <ReceiptIndianRupee size={24} />
              <span>Transactions</span>
            </A>
            <A
              href="/recurrings"
              class="flex flex-col items-center gap-1 text-xs"
              activeClass="text-foreground font-semibold"
              inactiveClass="text-foreground/60"
            >
              <Repeat size={24} />
              <span>Recurrings</span>
            </A>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
