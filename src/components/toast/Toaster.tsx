// toast.tsx
import { useCallback, useEffect, useState } from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { subscribe } from "./toastService";

export type ToastVariant = "success" | "danger" | "info";

type Toast = {
  id: string;
  description: string;
  time: number;
  variant: ToastVariant;
};

export type PublishParam = Omit<Toast, "id">;

const getVariantClasses = (variant: ToastVariant) => {
  switch (variant) {
    case "success":
      return "bg-success-500";
    case "danger":
      return "bg-danger-500";
    case "info":
    default:
      return "bg-info-500";
  }
};

export const Toaster = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const publish = useCallback(({ description, time, variant }: PublishParam) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, description, time, variant }]);
  }, []);

  // register with the toast event bus. pub-sub system
  useEffect(() => {
    const unsubscribe = subscribe(publish);
    return () => {
      unsubscribe();
    };
  }, [publish]);

  // data-[state=open]:animate-toast-slide-in
  // data-[state=closed]:animate-close

  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map(({ id, description, time, variant }) => (
        <RadixToast.Root
          key={id}
          duration={time ?? 5000}
          onOpenChange={(open) => {
            if (!open) {
              setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
              }, 1000); // clean garbage after the goodbye animation
            }
          }}
          className={`ToastRoot relative flex items-center gap-4 rounded px-4 py-5 shadow-lg text-white 
            ${getVariantClasses(variant)}`}
          aria-live="polite"
        >
          <RadixToast.Description asChild>
            <p className="text-sm font-medium">{description}</p>
          </RadixToast.Description>
          <RadixToast.Close
            className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100 focus:outline-none"
            aria-label="Close"
          >
            ✕
          </RadixToast.Close>
        </RadixToast.Root>
      ))}
      <RadixToast.Viewport className="fixed bottom-4 right-4 w-[360px] max-w-full z-z-toast flex flex-col gap-4 outline-none" />
    </RadixToast.Provider>
  );
};
