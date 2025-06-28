import { type ColumnDef, flexRender, getCoreRowModel, type Updater, useReactTable } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { useState } from "react";
import type { CompanyDto } from "../../api/SwaggerSdk";
import type { Pagination } from "../../hooks/company/WiP/useCompaniesTableData";

type DataTableOffsetProps = {
  data: CompanyDto[];
  pagination: Pagination;
  onRowSelect: (row: number | undefined) => void;
};

const columns: ColumnDef<CompanyDto>[] = [
  {
    id: "compId",
    header: "id",
    cell: ({ row }) => row.id,
  },
  {
    accessorKey: "companyName", // makes `cell: (info) => info.getValue()`  work!

    id: "name",
    header: "name",
    footer: (props) => props.column.id,
    cell: (info) => info.getValue(),
  },
];

export const DataTableOffset = ({ data, onRowSelect, pagination }: DataTableOffsetProps) => {
  const [rowSelection, setRowSelection] = useState(() => {
    if (data.length === 0) return {};
    return { [data[0].id ?? "0"]: true };
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const rowChangePreventDeselect = (newSelection: Updater<Record<string, boolean>>) => {
    const updatedSelection = typeof newSelection === "function" ? newSelection({}) : newSelection;
    if (Object.keys(updatedSelection).length === 0) return;

    console.log("CLICK > ", updatedSelection);
    setRowSelection(updatedSelection);
  };

  const table = useReactTable<CompanyDto>({
    data,
    columns,
    getRowId: (row) => {
      if (!row.id) throw new Error("row.id is undefined/null");
      return row.id.toString();
    },
    pageCount: Math.ceil(pagination.totalCount / pagination.pageSize),
    state: {
      rowSelection,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: rowChangePreventDeselect,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize })
          : updater;
      pagination.setPageIndex(next.pageIndex);
      pagination.setPageSize(next.pageSize);
    },
    manualPagination: true,
    // getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  // TODO: delete later
  useEffect(() => {
    // @ts-ignore
    window.__table = table;
  }, [table]);

  useEffect(() => {
    const selectedId: string | undefined = Object.keys(rowSelection)[0];
    onRowSelect(selectedId ? Number(selectedId) : undefined);
  }, [rowSelection, table, onRowSelect]);

  return (
    <div className="bg-bg-table text-text-body" onClick={() => console.log("log data ", rowSelection)}>
      <table className="w-full">
        <thead className="bg-bg-header-row text-text-header-row ">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`px-4 py-1 ${header.index === 0 ? "w-20" : ""}`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                onClick={row.getToggleSelectedHandler()}
                className={`${
                  row.getIsSelected() ? "bg-bg-row-selected" : "hover:bg-bg-row-hover"
                } border-b-1 border-border  `}
              >
                {row.getVisibleCells().map((cell, cellIndex) => {
                  return (
                    <td key={cell.id} className={`px-4 text-sm py-1 ${cellIndex === 0 ? "text-right" : ""}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={20} className="bg-bg-header-row text-text-header-row p-1">
              Showing {pagination.totalCount} results
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div>
        {Object.keys(rowSelection).length} of {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>
      <hr />
    </div>
  );
};
