import { flexRender, type Row } from "@tanstack/react-table";
import type { CompanyDto } from "../../api/SwaggerSdk";
import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

type VirtualizedTableBodyProps = {
  rows: Row<CompanyDto>[];
  fetchMoreOnBottomReached: (containerRefElement?: HTMLDivElement | null) => void;
  scrollingTableContainerRef: React.RefObject<HTMLDivElement | null>;
};

export const VirtualizedTableBody = ({
  rows,
  fetchMoreOnBottomReached,
  scrollingTableContainerRef,
}: VirtualizedTableBodyProps) => {
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 25, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => scrollingTableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });
  console.log("virtualized body renders");

  return (
    <div
      className="overflow-auto relative w-full h-full"
      ref={scrollingTableContainerRef}
      onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
    >
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }} className="relative">
        <div
          className="absolute w-full"
          style={{ transform: `translateY(${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px)` }}
        >
          {/* The virtual rows */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                // 2 lines. keeps the __virt.getTotalSize() accurate. keeps the Phantom div accurate. Scroll bar is smooth,
                // especially visible on mobile. Without it the scrollbar on mobile just keeps twerking, shrinking and expanding
                // also rowVirtualizer.scrollToIndex(100) works with it.
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                // --
                key={row.id}
                onClick={row.getToggleSelectedHandler()}
                className={`${
                  row.getIsSelected() ? "bg-bg-row-selected" : "hover:bg-bg-row-hover"
                } border-b-1 border-border  grid grid-cols-[70px_1fr] `}
              >
                {row.getVisibleCells().map((cell, cellIndex) => {
                  return (
                    <div
                      key={cell.id}
                      className={`px-4 overflow-hidden text-sm py-1 ${cellIndex === 0 ? "text-right" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
