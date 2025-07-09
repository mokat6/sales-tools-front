import { KeyValue } from "../components/KeyValue";
import ClassificationSelector from "../components/ClassificationSelector";
import DeleteCompButton from "../components/DeleteCompButton";
import { useCallback, useState } from "react";
import formatCompany from "../format/formatCompany";
import { DataTable } from "../dataTables/infinite/DataTable";
import {
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import type { CompanyDto } from "../api/SwaggerSdk";
import { columns } from "../dataTables/infinite/columns";

import type { CompaniesInfiniteQueryResult } from "../hooks/company/useCompaniesTableDataCursor_infinite";
import { useCompany_InfinityCursor } from "../hooks/company/useCompany";
import { ContactsContainer } from "../contacts/ContactsContainer";

type ViewBigDataContentProps = Omit<CompaniesInfiniteQueryResult, "isLoading"> & {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

function ViewBigDataContent({
  tableData,
  totalDbRowCount,
  isFetching,
  fetchNextPage,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
  hasNextPage,
}: ViewBigDataContentProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
    const firstRowId = tableData[0]?.id;
    return firstRowId ? { [firstRowId]: true } : {};
  });

  const selectedCompanyIdString: string | undefined = Object.keys(rowSelection)[0];
  const selectedCompanyId = selectedCompanyIdString ? Number(selectedCompanyIdString) : undefined;
  const { data: selectedCompany } = useCompany_InfinityCursor(selectedCompanyId);

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

  const reselectAfterCompanyDelete = useCallback(
    (deletedRowIndex: number | undefined) => {
      if (deletedRowIndex === undefined) return;

      const allRows = table.getRowModel().rows;
      const nextId = allRows[deletedRowIndex]?.id ?? allRows[deletedRowIndex - 1]?.id;
      table.setRowSelection(nextId ? { [nextId]: true } : {});
    },
    [table]
  );

  console.log("Rendering +++++++ .... ViewBigDataContent, selectedCompanyId> ", selectedCompanyId);
  return (
    <>
      <div className="flex gap-20  items-start pt-6 bg-bg-background">
        <section className="">
          <DataTable table={table} {...{ totalDbRowCount, isFetching, fetchNextPage, hasNextPage }} />
        </section>
        <section className="flex flex-col gap-5">
          <div className="flex flex-col text-text-body">
            <span>Company ID:</span>
            <span className="text-3xl self-center min-h-12">{selectedCompanyId}</span>
          </div>

          <ClassificationSelector id={selectedCompanyId} value={selectedCompany?.classification} />

          <DeleteCompButton
            selectedIndex={selectedIndex}
            companyId={selectedCompanyId}
            tableRowReselectFn={reselectAfterCompanyDelete}
          />
        </section>
        <section className="flex flex-col gap-10">
          <div className="min-h-135">
            <KeyValue keyTitle="Key" valueTitle="Value" data={formatCompany(selectedCompany)} />
          </div>
          <ContactsContainer compId={selectedCompanyId} />
        </section>
      </div>
    </>
  );
}

export default ViewBigDataContent;
