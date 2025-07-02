import { flexRender, type Table } from "@tanstack/react-table";
import { useCallback, useEffect, useRef } from "react";
import { VirtualizedTableBody } from "./VirtualizedTableBody";
import type { CompanyDto } from "../../api/SwaggerSdk";
import type { FetchNextPageFn } from "../../hooks/company/useCompaniesTableDataCursor_infinite";
import { TextInput } from "../../components/TextInput";

export type DataTableProps = {
  table: Table<CompanyDto>;
  totalDbRowCount: number;
  isFetching: boolean;
  fetchNextPage: FetchNextPageFn;
  hasNextPage: boolean;
};

export const DataTable = ({ table, totalDbRowCount, isFetching, fetchNextPage, hasNextPage }: DataTableProps) => {
  const scrollingTableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const totalFetched = rows.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching && hasNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, hasNextPage]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(scrollingTableContainerRef.current);
  }, [fetchMoreOnBottomReached, scrollingTableContainerRef]);

  return (
    <div className="bg-bg-table text-text-body">
      <TextInput
        placeholder="Search companies..."
        value={table.getState().globalFilter}
        onChange={table.setGlobalFilter}
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
      <div className=" w-80 h-150">
        <VirtualizedTableBody
          rows={rows}
          scrollingTableContainerRef={scrollingTableContainerRef}
          fetchMoreOnBottomReached={fetchMoreOnBottomReached}
        />
      </div>
      {/* Footer */}
      <div className="bg-bg-header-row text-text-header-row p-1 ">
        Loaded {totalFetched} of {totalDbRowCount} results
      </div>
    </div>
  );
};
