import { getCoreRowModel, type SortingState, type Updater, useReactTable } from "@tanstack/react-table";
import type { DataTableProps } from "./DataTable";
import type { CompanyDto } from "../../api/SwaggerSdk";
import { columns } from "./columns";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCompaniesTableDataCursor_infinite } from "../../hooks/company/useCompaniesTableDataCursor_infinite";

type useDataTablePresenterProps = DataTableProps;
const PAGE_SIZE = 37;

export function useDataTablePresenter({ rowSelection, setRowSelection }: useDataTablePresenterProps) {
  // useEffect(() => {
  //   window.__table = table;
  // }, []);

  // Selects row 0 on first open (first data load). Selects next line on delete.
  // useEffect(() => {
  //   if (rows.length === 0) {
  //     if (selectedRowId) setRowSelection({}); // when deleting the last row
  //     return;
  //   }

  //   const currentRowExists = !!selectedRowId && rows.some((row) => row.id === selectedRowId);

  //   if (!selectedRowId || !currentRowExists) {
  //     const newId = rows[selectedRowIndexRef.current]?.id ?? rows[selectedRowIndexRef.current - 1]?.id;

  //     setRowSelection(() => {
  //       if (!newId) return {};
  //       return { [newId]: true };
  //     });
  //   }
  // }, [selectedRowId, rows, setRowSelection]);

  // ---------------------

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
