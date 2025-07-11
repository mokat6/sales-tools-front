import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  position?: "center" | "left";
}

export const Modal = ({ open, onOpenChange, title, children, position = "center" }: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content
          className={`fixed top-1/2 border border-border ${
            position === "center" ? "left-1/2" : "left-1/4"
          } w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-bg-background p-6 rounded-lg shadow-lg z-50`}
        >
          {title && <Dialog.Title className="text-lg font-semibold text-text-body mb-4">{title}</Dialog.Title>}
          {children}
          <Dialog.Close asChild>
            <button
              className=" rounded-full p-1 absolute top-3 right-3 bg-bg-header-row hover:bg-action-secondary cursor-pointer"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
