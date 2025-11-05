import type { Component } from "solid-js";
import "./index.css";

interface LoaderProps {
  size?: number; // in px
  color?: string; // any valid CSS color
}

const Loader: Component<LoaderProps> = (props) => {
  const size = () => props.size ?? 24;
  const color = () => props.color ?? "currentColor";

  return (
    <svg
      width={size()}
      height={size()}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={color()}
      stroke="none"
      style={{ color: color() }}
    >
      <rect class="spinner_jCIR" x="1" y="6" width="2.8" height="12" />
      <rect
        class="spinner_jCIR spinner_upm8"
        x="5.8"
        y="6"
        width="2.8"
        height="12"
      />
      <rect
        class="spinner_jCIR spinner_2eL5"
        x="10.6"
        y="6"
        width="2.8"
        height="12"
      />
      <rect
        class="spinner_jCIR spinner_Rp9l"
        x="15.4"
        y="6"
        width="2.8"
        height="12"
      />
      <rect
        class="spinner_jCIR spinner_dy3W"
        x="20.2"
        y="6"
        width="2.8"
        height="12"
      />
    </svg>
  );
};

export default Loader;
