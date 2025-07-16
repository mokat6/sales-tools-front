import { DownloadCloud, Loader2 } from "lucide-react";
import { Tooltip } from "./Tooltip";

type TableToolbarButtonProps = {
  callbackFn: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  tooltipMsg?: string;
};

export const TableToolbarButton = ({ callbackFn, isLoading, isDisabled, tooltipMsg }: TableToolbarButtonProps) => {
  const handleClick = () => {
    if (isLoading) return;
    console.log("click DOWNLOAD ALL");
    callbackFn();
  };

  const button = (
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
  );
  return tooltipMsg ? <Tooltip message={tooltipMsg}>{button}</Tooltip> : button;
};
