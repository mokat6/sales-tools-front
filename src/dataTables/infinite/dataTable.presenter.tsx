import { getCoreRowModel, type Updater, useReactTable } from "@tanstack/react-table";
import type { DataTableProps } from "./DataTable";
import type { CompanyDto } from "../../api/SwaggerSdk";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

type useDataTablePresenterProps = DataTableProps & { tableContainerRef: React.RefObject<HTMLDivElement | null> };

export function useDataTablePresenter({
  onRowSelect,
  companies,
  fetchNextPage,
  isFetching,
  totalDbRowCount,
  tableContainerRef,
}: useDataTablePresenterProps) {
  const [rowSelection, setRowSelection] = useState(() => {
    if (companies.length === 0) return {};
    return { [companies[0].id ?? "0"]: true };
  });

  //   const [globalFilter, setGlobalFilter] = useState("");

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
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached, tableContainerRef]);

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

  return {
    totalFetched,
    rows,
    table,
    rowVirtualizer,
    totalDbRowCount,
    fetchMoreOnBottomReached,
  };
}
