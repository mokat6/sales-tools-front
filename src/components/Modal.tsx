import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  position?: "center" | "left";
  size?: "sm" | "md" | "lg" | "xl";
  ariaDescription: string;
}

const sizeClassMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-3xl",
  xl: "max-w-7xl",
};

export const Modal = ({
  open,
  onOpenChange,
  title,
  children,
  position = "center",
  ariaDescription,
  size = "xl",
}: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-z-overlay" />
        <Dialog.Content
          className={`fixed top-1/2 border border-border ${position === "center" ? "left-1/2" : "left-1/4"} w-full ${
            sizeClassMap[size]
          } -translate-x-1/2 -translate-y-1/2 bg-bg-background p-6 rounded-lg shadow-lg z-z-modal`}
        >
          <Dialog.Description className="sr-only">{ariaDescription}</Dialog.Description>
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
