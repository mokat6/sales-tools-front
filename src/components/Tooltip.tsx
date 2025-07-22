import * as TooltipEl from "@radix-ui/react-tooltip";

type TooltipProps = {
  children: React.ReactNode;
  message: string | undefined;
  contentClass?: string;
};

export const Tooltip = ({ children, message, contentClass }: TooltipProps) => {
  if (!message) return null;

  return (
    <TooltipEl.Provider delayDuration={100}>
      <TooltipEl.Root>
        <TooltipEl.Trigger asChild>{children}</TooltipEl.Trigger>
        <TooltipEl.Portal>
          <TooltipEl.Content
            className={`bg-text-body  text-bg-background text-sm px-2 py-1 rounded shadow-md ${contentClass}`}
            side="top"
            sideOffset={5}
          >
            {message}
            <TooltipEl.Arrow className="fill-text-body" />
          </TooltipEl.Content>
        </TooltipEl.Portal>
      </TooltipEl.Root>
    </TooltipEl.Provider>
  );
};
