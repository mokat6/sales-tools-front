import * as Tooltip from "@radix-ui/react-tooltip";

import { DownloadCloud, Loader2 } from "lucide-react";

type TableToolbarButtonProps = {
  callbackFn: () => void;
  isLoading: boolean;
  isDisabled: boolean;
};

export const TableToolbarButton = ({ callbackFn, isLoading, isDisabled }: TableToolbarButtonProps) => {
  const handleClick = () => {
    if (isLoading) return;
    console.log("click DOWNLOAD ALL");
    callbackFn();
  };
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className={`p-2 rounded hover:bg-bg-header-hover 
              active:scale-95 active:bg-bg-header-hover/80  
              ${isLoading || isDisabled ? "cursor-not-allowed opacity-70" : "hover:shadow"}
              `}
            onClick={handleClick}
            disabled={isLoading || isDisabled}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-text-body  text-bg-background text-sm px-2 py-1 rounded shadow-md"
            side="top"
            sideOffset={5}
          >
            Load all rows in one go
            <Tooltip.Arrow className="fill-text-body" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
