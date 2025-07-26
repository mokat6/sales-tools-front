import type { CompanyDto } from "@/api/SwaggerSdk";
import { getCoreRowModel, useReactTable, type RowSelectionState, type Updater } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import type { MasterTableProps } from "./MasterTable";
import { columns } from "./columns";
import { TableToolbarButton } from "@/components/TableToolbarButton";

type useMasterTableProps = MasterTableProps & { scrollingTableContainerRef: React.RefObject<HTMLDivElement | null> };
export const useMasterTable = ({
  fetchNextPage,
  hasNextPage,
  isFetching,
  totalDbRowCount,
  downloadAll,
  data,
  scrollingTableContainerRef,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
}: useMasterTableProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
    const firstRowId = data[0]?.id;
    return firstRowId ? { [firstRowId]: true } : {};
  });

  const rowChangePreventDeselect = (newSelection: Updater<Record<string, boolean>>) => {
    // because when you mouse click, it is always a function
    // when you __table.setRowSelection({2:true})  or ({}) or __table.resetRowSelection()  it is always an object.
    if (typeof newSelection === "function") {
      const updatedSelection = newSelection({});
      if (Object.keys(updatedSelection).length === 0) return;
      setRowSelection(updatedSelection);
    } else {
      setRowSelection(newSelection);
    }
  };

  const table = useReactTable<CompanyDto>({
    data,
    columns,
    getRowId: (row) => {
      if (row.id === undefined) throw new Error("row.id is undefined/null, set up in useReactTable({}) options obj");
      return row.id.toString();
    },
    state: {
      rowSelection,
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    manualFiltering: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: rowChangePreventDeselect,
    manualSorting: true, // SERVER-SIDE sorting
    enableMultiSort: false,
    onSortingChange: setSorting, // the sorting data is [{colId, isDesc}], always 0 or 1 item in [] when enableMultiSort: false
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  const tableToolbarDownloadAllBtn = (
    <TableToolbarButton
      callbackFn={downloadAll}
      isLoading={isFetching}
      isDisabled={!hasNextPage}
      tooltipMsg="Load all rows in one go"
    />
  );
  const selectedIndex: number | undefined = table.getSelectedRowModel().rows[0]?.index;

  const reselectAfterCompanyDelete = useCallback(() => {
    if (selectedIndex === undefined) return;

    const allRows = table.getRowModel().rows;
    const nextId = allRows[selectedIndex]?.id ?? allRows[selectedIndex - 1]?.id;
    table.setRowSelection(nextId ? { [nextId]: true } : {});
  }, [selectedIndex, table]);

  const selectedCompanyIdString: string | undefined = Object.keys(rowSelection)[0];
  const selectedCompanyId = selectedCompanyIdString ? Number(selectedCompanyIdString) : undefined;

  // ---------
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

  return {
    table,
    fetchNextPage,
    totalDbRowCount,
    fetchMoreOnBottomReached,
    toolbarButtons: [tableToolbarDownloadAllBtn],
    selectedCompanyId,
    reselectAfterCompanyDelete,
  };
};
