import type { CompaniesInfiniteQueryResult } from "@/hooks/company/useCompaniesTableDataCursor_infinite";
import {
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { MasterTable } from "./MasterTable";
import type { CompanyDto } from "@/api/SwaggerSdk";
import { columns } from "./columns";
import { forwardRef, useCallback, useImperativeHandle } from "react";
import { TableToolbarButton } from "@/components/TableToolbarButton";

type MasterTableBusinessProps = Omit<CompaniesInfiniteQueryResult, "isLoading"> & {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
};

export const MasterTableBusiness = forwardRef<MasterTableHandle, MasterTableBusinessProps>(
  (
    {
      downloadAll,
      fetchNextPage,
      globalFilter,
      hasNextPage,
      isFetching,
      setGlobalFilter,
      setSorting,
      sorting,
      tableData,
      totalDbRowCount,
      rowSelection,
      setRowSelection,
    },
    ref
  ) => {
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
      data: tableData,
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

    const selectedIndex: number | undefined = table.getSelectedRowModel().rows[0]?.index;

    const reselectRowAfterDelete = useCallback(
      (selectedIndex: number | undefined) => {
        console.log("handling reselect row after delete - ", selectedIndex);
        if (selectedIndex === undefined) return;

        const allRows = table.getRowModel().rows;
        const nextId = allRows[selectedIndex]?.id ?? allRows[selectedIndex - 1]?.id;
        table.setRowSelection(nextId ? { [nextId]: true } : {});
      },
      [table]
    );

    const tableToolbarDownloadAllBtn = (
      <TableToolbarButton
        callbackFn={downloadAll}
        isLoading={isFetching}
        isDisabled={!hasNextPage}
        tooltipMsg="Load all rows in one go"
      />
    );

    useImperativeHandle(ref, () => ({
      reselectRowAfterDelete,
      selectedIndex,
    }));

    return (
      <MasterTable
        table={table}
        totalDbRowCount={totalDbRowCount}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        toolbarButtons={[tableToolbarDownloadAllBtn]}
      />
    );
  }
);

export type MasterTableHandle = {
  reselectRowAfterDelete: (selectedIndex: number | undefined) => void;
  selectedIndex: number | undefined;
};
