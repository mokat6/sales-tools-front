import { flexRender } from "@tanstack/react-table";
import { useDataTablePresenter } from "./dataTable.presenter";
import React from "react";
import { Spinner } from "../../components/Spinner";

export type DataTableProps = {
  onRowSelect: (row: number | undefined) => void;
};

export const DataTable = (props: DataTableProps) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const {
    totalFetched,
    rows,
    table,
    rowVirtualizer,
    totalDbRowCount,
    fetchMoreOnBottomReached,
    globalFilter,
    setGlobalFilter,
    isLoading,
  } = useDataTablePresenter({ ...props, tableContainerRef });

  const renderTableBody = () => {
    if (isLoading)
      return (
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      );

    return (
      <div
        className="overflow-auto relative w-full h-full"
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        ref={tableContainerRef}
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }} className="relative">
          <div
            className="absolute"
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

  return (
    <div className="bg-bg-table text-text-body">
      <input
        type="text"
        placeholder="Search companies..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      {/* Header */}
      <div className="font-bold grid grid-cols-[70px_1fr]">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => {
            return (
              <div
                key={header.id}
                className={`px-4 py-1 border cursor-pointer select-none`}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted() as string] ?? null}
              </div>
            );
          })
        )}
      </div>
      {/* Table Body */}
      <div className=" w-80 h-150">{renderTableBody()}</div>
      {/* Footer */}
      <div className="bg-bg-header-row text-text-header-row p-1">
        Loaded {totalFetched} of {totalDbRowCount} results
      </div>
    </div>
  );
};
