import { Tabs } from "@kobalte/core/tabs";
import { For, type Accessor, type JSXElement, type Setter } from "solid-js";

function UITabs<T extends string>({
  tabs,
  currentTab,
  setCurrentTab,
}: {
  tabs: { label: JSXElement; value: T; content: JSXElement }[];
  currentTab?: Accessor<T>;
  setCurrentTab?: Setter<T>;
}) {
  return (
    <>
      <Tabs
        aria-label="Tabs"
        class="tabs w-full"
        value={currentTab!()}
        onChange={setCurrentTab}
      >
        <Tabs.List class="tabs__list relative flex items-center border-b border-b-slate-300">
          <For each={tabs}>
            {(tab) => (
              <Tabs.Trigger
                class="tabs__trigger inline-block outline-none px-4 py-2 hover:bg-slate-300 focus-visible:bg-slate-300 capitalize"
                value={tab.value}
              >
                {tab.label}
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator class="tabs__indicator h-0.5 absolute bg-purple-700 -bottom-px transition-all duration-300" />
        </Tabs.List>
        <For each={tabs}>
          {(tab) => (
            <Tabs.Content class="tabs__content pt-4" value={tab.value}>
              {tab.content}
            </Tabs.Content>
          )}
        </For>
      </Tabs>
    </>
  );
}

export default UITabs;
