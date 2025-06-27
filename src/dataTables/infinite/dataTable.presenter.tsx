import { getCoreRowModel, type SortingState, type Updater, useReactTable } from "@tanstack/react-table";
import type { DataTableProps } from "./DataTable";
import type { CompanyDto } from "../../api/SwaggerSdk";
import { columns } from "./columns";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCompaniesTableDataCursor_infinite } from "../../hooks/company/useCompaniesTableDataCursor_infinite";

type useDataTablePresenterProps = DataTableProps;
const PAGE_SIZE = 37;

export function useDataTablePresenter({ rowSelection, setRowSelection }: useDataTablePresenterProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const scrollingTableContainerRef = useRef<HTMLDivElement>(null);
  const selectedRowIndexRef = useRef(0);

  const { companies, totalDbRowCount, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useCompaniesTableDataCursor_infinite({ pageSize: PAGE_SIZE, columnSort: sorting[0], globalFilter });

  const totalFetched = companies.length;
  const selectedRowId: string | undefined = Object.keys(rowSelection)[0];

  const rowChangePreventDeselect = (newSelection: Updater<Record<string, boolean>>) => {
    const updatedSelection = typeof newSelection === "function" ? newSelection({}) : newSelection;
    if (Object.keys(updatedSelection).length === 0) return;

    console.log("CLICK > ", updatedSelection);
    setRowSelection(updatedSelection);
    // ✅ Update index if a row is selected
    const selectedId = Object.keys(updatedSelection)[0];
    if (selectedId) {
      const row = table.getRow(selectedId);
      // if (row) setSelectedRowIndex(row.index);
      if (row) selectedRowIndexRef.current = row.index;
    }
  };

  const table = useReactTable<CompanyDto>({
    data: companies,
    columns,
    getRowId: (row) => {
      if (!row.id) throw new Error("row.id is undefined/null, set up in useReactTable({}) options obj");
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

  useEffect(() => {
    window.__table = table;
  }, []);

  const { rows } = table.getRowModel();

  // Selects row 0 on first open (first data load). Selects next line on delete.
  useEffect(() => {
    if (rows.length === 0) {
      if (selectedRowId) setRowSelection({}); // when deleting the last row
      return;
    }

    const currentRowExists = !!selectedRowId && rows.some((row) => row.id === selectedRowId);

    if (!selectedRowId || !currentRowExists) {
      const newId = rows[selectedRowIndexRef.current]?.id ?? rows[selectedRowIndexRef.current - 1]?.id;

      setRowSelection(() => {
        if (!newId) return {};
        return { [newId]: true };
      });
    }
  }, [selectedRowId, rows, setRowSelection]);

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
    rowSelection,
  };
}
