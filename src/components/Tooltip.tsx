import * as TooltipEl from "@radix-ui/react-tooltip";

type TooltipProps = {
  children: React.ReactNode;
  message: string | undefined;
  noPortal?: boolean;
};

export const Tooltip = ({ children, message, noPortal = false }: TooltipProps) => {
  if (!message) return null;

  const contentNode = (
    <TooltipEl.Content
      className="bg-text-body  text-bg-background text-sm px-2 py-1 rounded shadow-md"
      side="top"
      sideOffset={5}
    >
      {message}
      <TooltipEl.Arrow className="fill-text-body" />
    </TooltipEl.Content>
  );

  return (
    <TooltipEl.Provider delayDuration={100}>
      <TooltipEl.Root>
        <TooltipEl.Trigger asChild>{children}</TooltipEl.Trigger>
        {!noPortal ? <TooltipEl.Portal>{contentNode}</TooltipEl.Portal> : contentNode}
      </TooltipEl.Root>
    </TooltipEl.Provider>
  );
};
