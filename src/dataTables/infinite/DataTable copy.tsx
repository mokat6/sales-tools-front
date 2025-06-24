import { type ColumnDef, flexRender, getCoreRowModel, type Updater, useReactTable } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { useState } from "react";
import type { CompanyDto, ICompaniesResponseCursor } from "../../api/SwaggerSdk";
import type { PaginationCursor } from "../../hooks/company/useCompaniesTableDataCursor";
import { useCompaniesTableDataCursor_infinite } from "../../hooks/company/useCompaniesTableDataCursor_infinite";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { InfiniteData } from "@tanstack/react-query";
import { columns } from "./columns";

type DataTableProps = {
  companies: CompanyDto[];
  onRowSelect: (row: number | undefined) => void;
  isFetching: boolean;
  fetchNextPage: () => void;
  totalDbRowCount: number;
};

export const DataTable = ({ onRowSelect, companies, fetchNextPage, isFetching, totalDbRowCount }: DataTableProps) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [rowSelection, setRowSelection] = useState(() => {
    if (companies.length === 0) return {};
    return { [companies[0].id ?? "0"]: true };
  });

  const [globalFilter, setGlobalFilter] = useState("");

  const totalFetched = companies.length;

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching && totalFetched < totalDbRowCount) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDbRowCount]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const rowChangePreventDeselect = (newSelection: Updater<Record<string, boolean>>) => {
    const updatedSelection = typeof newSelection === "function" ? newSelection({}) : newSelection;
    if (Object.keys(updatedSelection).length === 0) return;

    console.log("CLICK > ", updatedSelection);
    setRowSelection(updatedSelection);
  };

  const table = useReactTable<CompanyDto>({
    data: companies,
    columns,
    getRowId: (row) => {
      if (!row.id) throw new Error("row.id is undefined/null");
      return row.id.toString();
    },
    // state is where you manually control parts of the table's internal state, instead of letting the table manage them
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: rowChangePreventDeselect,

    // manualPagination: true,
    // getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  // TODO: delete later
  useEffect(() => {
    // @ts-ignore
    window.__table = table;
  }, [table]);

  useEffect(() => {
    const selectedId: string | undefined = Object.keys(rowSelection)[0];
    onRowSelect(selectedId ? Number(selectedId) : undefined);
  }, [rowSelection, table, onRowSelect]);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 25, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });
  window.__virt = rowVirtualizer;

  return (
    <div className="bg-bg-table text-text-body">
      {/* Header */}
      <div className="font-bold grid grid-cols-[70px_1fr]">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => {
            return (
              <div
                key={header.id}
                // colSpan={header.colSpan}
                className={`px-4 py-1 border`}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            );
          })
        )}
      </div>
      {/* Table Body */}
      <div
        className="overflow-auto relative w-80 h-150"
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
      {/* Footer */}
      <div className="bg-bg-header-row text-text-header-row p-1">
        Loaded {totalFetched} of {totalDbRowCount} results
      </div>
    </div>
  );
};
