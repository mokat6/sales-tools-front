import { flexRender, type Table } from "@tanstack/react-table";
import { useCallback, useEffect, useRef } from "react";
import { VirtualizedTableBody } from "./VirtualizedTableBody";
import type { CompanyDto } from "../../api/SwaggerSdk";
import type { FetchNextPageFn } from "../../hooks/company/useCompaniesTableDataCursor_infinite";
import { TextInput } from "../../components/TextInput";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableFooterButton } from "../../components/TableFooterButton";

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
      <TextInput placeholder="Filter..." value={table.getState().globalFilter} onChange={table.setGlobalFilter} />
      {/* Header */}
      <div className="font-bold grid grid-cols-[70px_1fr] bg-bg-header-row text-text-header-row border border-border">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => {
            return (
              <div
                key={header.id}
                className={`px-4 py-1  cursor-pointer select-none flex items-center gap-1 hover:bg-bg-header-hover`}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getCanSort() &&
                  ({
                    asc: <ArrowUp size={14} className="text-action-primary" />,
                    desc: <ArrowDown size={14} className="text-action-primary" />,
                  }[header.column.getIsSorted() as string] ?? (
                    <ArrowUpDown size={14} className="text-text-header-row" />
                  ))}
              </div>
            );
          })
        )}
      </div>
      {/* Table Body */}
      <div className=" w-80 h-150 ">
        <VirtualizedTableBody
          rows={rows}
          scrollingTableContainerRef={scrollingTableContainerRef}
          fetchMoreOnBottomReached={fetchMoreOnBottomReached}
        />
      </div>
      {/* Footer */}
      <div className="bg-bg-header-row text-text-header-row p-1 border-border border flex justify-between px-3 items-center">
        <div>
          Loaded {totalFetched} of {totalDbRowCount} results
        </div>
        <TableFooterButton />
      </div>
    </div>
  );
};
