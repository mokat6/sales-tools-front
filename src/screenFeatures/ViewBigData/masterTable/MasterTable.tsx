import { useCallback, useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, FilterX } from "lucide-react";
import { flexRender, type Table } from "@tanstack/react-table";
import { VirtualizedTableBody } from "./VirtualizedTableBody";
import type { CompanyDto } from "@/api/SwaggerSdk";
import type { FetchNextPageFn } from "@/hooks/company/useCompaniesTableDataCursor_infinite";
import { TextInput } from "@/components/TextInput";

export type MasterTableProps = {
  table: Table<CompanyDto>;
  totalDbRowCount: number;
  isFetching: boolean;
  fetchNextPage: FetchNextPageFn;
  hasNextPage: boolean;
  toolbarButtons: React.ReactNode[];
};

const emptyState = (isFilterApplied: boolean) => (
  <div className="flex flex-col items-center justify-center text-text-secondary py-12 gap-2 text-center">
    {isFilterApplied && (
      <div>
        <FilterX size={32} className="text-muted-foreground mb-2" />
      </div>
    )}
    <div className="text-lg font-medium">
      {isFilterApplied ? "No companies match your filter." : "No companies found."}
    </div>
    <div className="text-sm">
      {isFilterApplied ? "Try adjusting the search." : "Start by adding a new company to populate this table."}
    </div>
  </div>
);

export const MasterTable = ({
  table,
  totalDbRowCount,
  isFetching,
  fetchNextPage,
  hasNextPage,
  toolbarButtons,
}: MasterTableProps) => {
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
        {rows.length === 0 ? (
          emptyState(!!table.getState().globalFilter)
        ) : (
          <VirtualizedTableBody
            rows={rows}
            scrollingTableContainerRef={scrollingTableContainerRef}
            fetchMoreOnBottomReached={fetchMoreOnBottomReached}
          />
        )}
      </div>
      {/* Footer */}
      <div className="bg-bg-header-row text-text-header-row p-1 border-border border flex justify-between px-3 items-center">
        <div>
          Loaded {totalFetched} of {totalDbRowCount} results
        </div>
        {/* Toolbar buttons */}
        <div>
          {toolbarButtons.map((button, i) => (
            <div key={i}>{button}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
