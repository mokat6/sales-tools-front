import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type Row,
  type Table,
  type Updater,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect } from "react";
import { useState } from "react";
import type { CompanyDto } from "../../api/SwaggerSdk";

const columns: ColumnDef<CompanyDto>[] = [
  {
    id: "select",
    header: "select",
    cell: ({ row }) => (
      <div className="px-1">
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      </div>
    ),
  },
  {
    accessorKey: "companyName", // ✅ Add this

    id: "name",
    header: "name",
    footer: (props) => props.column.id,
    cell: (info) => info.getValue(),
  },
];

type DataTableProps = {
  data: CompanyDto[];
  onRowSelect: (row: number | undefined) => void;
};

export const DataTable = ({ data, onRowSelect }: DataTableProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  // const [data, setData] = useState(() => {
  //   return [
  //     { id: 34, name: "first Compa" },
  //     { id: 35, name: "Comp two" },
  //     { id: 36, name: "tree" },
  //   ];
  // });

  const handleRowSelectionChange = (newSelection: Updater<Record<string, boolean>>) => {
    const updatedSelection = typeof newSelection === "function" ? newSelection({}) : newSelection;
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
    state: {
      rowSelection,
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    <div className="bg-amber-400">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
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
                className={`${row.getIsSelected() ? "bg-amber-500" : ""}`}
              >
                {row.getVisibleCells().map((cell) => {
                  return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td className="p-1">
              <input
                type="checkbox"
                {...{
                  checked: table.getIsAllPageRowsSelected(),
                  onChange: table.getToggleAllPageRowsSelectedHandler(),
                }}
              />
            </td>
            <td colSpan={20}>Page Rows ({table.getRowModel().rows.length})</td>
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
