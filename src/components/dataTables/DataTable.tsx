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
import type { CompanyDto } from "./api/ApiTypes";

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
  onRowSelect: (row: CompanyDto | null) => void;
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
    console.log(updatedSelection);
    setRowSelection(updatedSelection);
  };

  const table = useReactTable({
    data,
    columns,
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

  useEffect(() => {
    // @ts-ignore
    window.__table = table;
  }, [table]);

  const selecting = (row: Row<CompanyDto>) => {
    const handler = row.getToggleSelectedHandler();
  };

  useEffect(() => {
    const keys = Object.keys(rowSelection);
    if (keys.length == 0) {
      onRowSelect(null);
      return;
    }
    const selectedRowId = keys[0]; // Since it's single-select
    const selectedRow = table.getRowModel().rowsById[selectedRowId]?.original ?? null;
    onRowSelect(selectedRow);
  }, [rowSelection, table, onRowSelect, data]);

  return (
    <div className="bg-amber-400" onClick={() => console.log("row selection: ", rowSelection)}>
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
