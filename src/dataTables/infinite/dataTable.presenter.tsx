import { getCoreRowModel, type SortingState, type Updater, useReactTable } from "@tanstack/react-table";
import type { DataTableProps } from "./DataTable";
import type { CompanyDto } from "../../api/SwaggerSdk";
import { columns } from "./columns";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCompaniesTableDataCursor_infinite } from "../../hooks/company/useCompaniesTableDataCursor_infinite";

type useDataTablePresenterProps = DataTableProps;
const PAGE_SIZE = 12;

export function useDataTablePresenter({ onRowSelect }: useDataTablePresenterProps) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const scrollingTableContainerRef = useRef<HTMLDivElement>(null);

  const { companies, totalDbRowCount, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useCompaniesTableDataCursor_infinite({ pageSize: PAGE_SIZE, columnSort: sorting[0], globalFilter });

  const totalFetched = companies.length;

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
      sorting,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: rowChangePreventDeselect,

    // manualPagination: true,
    // getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true, // SERVER-SIDE sorting
    enableMultiSort: false,
    onSortingChange: setSorting, // the sorting data is [{colId, isDesc}], always 0 or 1 item in [] when enableMultiSort: false
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();

  useEffect(() => {
    const selectedId: string | undefined = Object.keys(rowSelection)[0];
    onRowSelect(selectedId ? Number(selectedId) : undefined);
  }, [rowSelection, table, onRowSelect]);

  // ---------------------

  const fetchMoreOnBottomReached = useCallback(
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
  useEffect(() => {
    fetchMoreOnBottomReached(scrollingTableContainerRef.current);
  }, [fetchMoreOnBottomReached, scrollingTableContainerRef]);

  console.log("presenter renders");
  return {
    totalFetched,
    rows,
    table,
    // rowVirtualizer,
    totalDbRowCount,
    fetchMoreOnBottomReached,
    globalFilter: globalFilter,
    setGlobalFilter: setGlobalFilter,
    isLoading,
    scrollingTableContainerRef,
  };
}
