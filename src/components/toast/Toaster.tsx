// toast.tsx
import { useEffect, useState } from "react";
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

export const Toaster = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const publish = ({ description, time, variant }: PublishParam) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, description, time, variant }]);
  };

  // register with the toast event bus. pub-sub system
  useEffect(() => {
    const unsubscribe = subscribe(publish);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map(({ id, description, time, variant }) => (
        <RadixToast.Root
          duration={time ?? 5000}
          // open={true} // needs to be together with onOpenChange
          onOpenChange={(open) => {
            if (!open) {
              // remove the toast from your state
              setToasts((prev) => prev.filter((t) => t.id !== id));
            }
          }}
          key={id}
          className={`rounded px-4 py-3 shadow-lg text-white data-[state=open]:animate-slideIn data-[state=closed]:animate-hide
            ${variant === "success" ? "bg-success-300" : variant === "danger" ? "bg-danger-300" : "bg-info-300"}`}
        >
          <RadixToast.Description>
            {description + "  "}
            <Countdown />
          </RadixToast.Description>
          <RadixToast.Close />
        </RadixToast.Root>
      ))}
      <RadixToast.Viewport className="fixed bottom-4 right-4 w-[360px] max-w-full z-z-toast" />
    </RadixToast.Provider>
  );
};

const Countdown = () => {
  const [time, setTime] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        if (t === 0) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{time}</span>;
};
