import { Show, type Accessor, type Component, type JSXElement } from "solid-js";

type ModalPropsType = {
  handleClose: () => void;
  isOpen: Accessor<boolean>;
  title: string;
  children: JSXElement;
};

const Modal: Component<ModalPropsType> = ({
  children,
  handleClose,
  isOpen,
  title,
}) => {
  return (
    <Show when={isOpen()}>
      <div
        onClick={() => {
          handleClose();
        }}
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          class="bg-gray-900 text-gray-200 rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col"
        >
          <h3 class="text-xl font-semibold mb-4 w-full border-b border-slate-800 pb-3">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </Show>
  );
};

export default Modal;
