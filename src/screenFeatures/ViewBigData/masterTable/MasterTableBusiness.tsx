import type { CompaniesInfiniteQueryResult } from "@/hooks/company/useCompaniesTableDataCursor_infinite";
import { getCoreRowModel, useReactTable, type Updater } from "@tanstack/react-table";
import { MasterTable } from "./MasterTable";
import type { CompanyDto } from "@/api/SwaggerSdk";
import { columns } from "./columns";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { TableToolbarButton } from "@/components/TableToolbarButton";
import { useMasterTableState } from "@/hooks/zustand/useMasterTableState";

type MasterTableBusinessProps = Omit<CompaniesInfiniteQueryResult, "isLoading"> & {};

export const MasterTableBusiness = forwardRef<MasterTableHandle, MasterTableBusinessProps>(
  ({ downloadAll, fetchNextPage, hasNextPage, isFetching, tableData, totalDbRowCount }, ref) => {
    const rowChangePreventDeselect = (updater: Updater<Record<string, boolean>>) => {
      // because when you mouse click, it is always a function
      // when you __table.setRowSelection({2:true})  or ({}) or __table.resetRowSelection()  it is always an object.
      if (typeof updater === "function") {
        const updatedSelection = updater({});
        console.log("rowChangePreventDeselect where it is function ", updatedSelection);
        if (Object.keys(updatedSelection).length === 0) return;
        setRowSelection(updatedSelection);
      } else {
        // allow empty object here, works as .clear() programmatically
        setRowSelection({ ...updater });
      }
    };

    const { globalFilter, rowSelection, setGlobalFilter, setRowSelection, setSorting, sorting } = useMasterTableState();

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
      getSelectedIndex: () => table.getSelectedRowModel().rows[0]?.index,
    }));

    // select index 0 table row on page load.
    useEffect(() => {
      const firstRowId = tableData[0]?.id;
      setRowSelection(firstRowId ? { [firstRowId]: true } : {});
    }, []);

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
  getSelectedIndex: () => number | undefined;
};
