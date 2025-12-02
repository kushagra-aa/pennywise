import { SegmentedControl } from "@kobalte/core/segmented-control";
import { For, type Accessor, type Component } from "solid-js";

import "./components.css";

type OptionsTabsPropsType = {
  title: string;
  value: Accessor<string>;
  handleChange: (val: string) => void;
  options: { label: string; value: string }[];
};

const OptionsTabs: Component<OptionsTabsPropsType> = ({
  value,
  options,
  handleChange,
  title,
}) => {
  return (
    <SegmentedControl
      value={value()}
      onChange={handleChange}
      class={"segmented-control"}
    >
      <SegmentedControl.Label class="segmented-control__label">
        {title}
      </SegmentedControl.Label>
      <div role="presentation" class="segmented-control__wrapper">
        <SegmentedControl.Indicator class="segmented-control__indicator" />
        <div role="presentation" class="segmented-control__items">
          <For each={options}>
            {(option) => (
              <SegmentedControl.Item
                value={option.value}
                class="segmented-control__item"
              >
                <SegmentedControl.ItemInput class="segmented-control__item-input" />
                <SegmentedControl.ItemLabel class="segmented-control__item-label">
                  {option.label}
                </SegmentedControl.ItemLabel>
              </SegmentedControl.Item>
            )}
          </For>
        </div>
      </div>
    </SegmentedControl>
  );
};

export default OptionsTabs;
