import { flexRender } from "@tanstack/react-table";
import { useDataTablePresenter } from "./dataTable.presenter";
import React from "react";
import { Spinner } from "../../components/Spinner";
import { VirtualizedTableBody } from "./VirtualizedTableBody";

export type DataTableProps = {
  onRowSelect: (row: number | undefined) => void;
};

export const DataTable = (props: DataTableProps) => {
  const {
    totalFetched,
    rows,
    table,
    // rowVirtualizer,
    totalDbRowCount,
    fetchMoreOnBottomReached,
    globalFilter,
    setGlobalFilter,
    isLoading,
    scrollingTableContainerRef,
  } = useDataTablePresenter({ ...props });

  const renderTableBody = () => {
    if (isLoading)
      return (
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      );

    return (
      <VirtualizedTableBody
        rows={rows}
        scrollingTableContainerRef={scrollingTableContainerRef}
        fetchMoreOnBottomReached={fetchMoreOnBottomReached}
      />
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
      <div className="bg-bg-header-row text-text-header-row p-1 ">
        Loaded {totalFetched} of {totalDbRowCount} results
      </div>
    </div>
  );
};
