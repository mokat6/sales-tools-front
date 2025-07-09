import * as Tooltip from "@radix-ui/react-tooltip";

import { DownloadCloud } from "lucide-react";

export const TableFooterButton = () => {
  const handleClick = () => console.log("click DOWNLOAD ALL");
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="p-2 rounded hover:bg-bg-header-hover" onClick={handleClick}>
            <DownloadCloud size={16} />
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
