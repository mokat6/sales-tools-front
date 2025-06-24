import { type ColumnDef, flexRender, getCoreRowModel, type Updater, useReactTable } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { useState } from "react";
import type { CompanyDto } from "../../api/SwaggerSdk";
import type { PaginationCursor } from "../../hooks/company/useCompaniesTableDataCursor";
import { useCompaniesTableDataCursor_infinite } from "../../hooks/company/useCompaniesTableDataCursor_infinite";
import { useVirtualizer } from "@tanstack/react-virtual";

type DataTableCursorProps = {
  onRowSelect: (row: number | undefined) => void;
};

const columns: ColumnDef<CompanyDto>[] = [
  {
    id: "compId",
    header: "id",
    cell: ({ row }) => row.id,
  },
  {
    accessorKey: "companyName", // makes `cell: (info) => info.getValue()`  work!

    id: "name",
    header: "name",
    footer: (props) => props.column.id,
    cell: (info) => info.getValue(),
  },
];

export const DataTableCursor_infinite = ({ onRowSelect }: DataTableCursorProps) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } = useCompaniesTableDataCursor_infinite(13);

  const flatData = React.useMemo(() => data?.pages.flatMap((page) => page.companies ?? []) ?? [], [data]);
  const totalDbRowCount = data?.pages?.[0].pagination?.totalCount ?? 0;
  const totalFetched = flatData.length;
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (scrollHeight - scrollTop - clientHeight < 10 && !isFetching && totalFetched < totalDbRowCount) {
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
    data: flatData,
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

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="bg-bg-table text-text-body">
      {/* Header */}
      <div className="font-bold flex">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="flex">
            {headerGroup.headers.map((header) => {
              return (
                <div
                  key={header.id}
                  // colSpan={header.colSpan}
                  className={`px-4 py-1 ${header.index === 0 ? "w-20" : ""}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              );
            })}
          </div>
        ))}
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
                  key={row.id}
                  onClick={row.getToggleSelectedHandler()}
                  className={`${
                    row.getIsSelected() ? "bg-bg-row-selected" : "hover:bg-bg-row-hover"
                  } border-b-1 border-border flex `}
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
        Showing {data?.pages[0].pagination?.totalCount} results
      </div>
    </div>
  );
};
