import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { ContactDto } from "../api/SwaggerSdk";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

type ContactTableProps = {
  columns: ColumnDef<ContactDto>[];
  data: ContactDto[];
};

export function ContactTable({ columns, data }: ContactTableProps) {
  const table = useReactTable<ContactDto>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className="border w-full border-border">
      <thead className="bg-bg-header-row">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className=" px-2 py-1 text-left cursor-pointer hover:bg-gray-100"
                onClick={header.column.getToggleSortingHandler()}
                aria-sort={
                  header.column.getIsSorted()
                    ? header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <div className="flex items-center gap-1 text-text-header-row select-none">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() &&
                    ({
                      asc: <ArrowUp size={14} className="text-action-primary" />,
                      desc: <ArrowDown size={14} className="text-action-primary" />,
                    }[header.column.getIsSorted() as string] ?? (
                      <ArrowUpDown size={14} className="text-text-header-row" />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="bg-bg-table">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-bg-row-hover">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border-t border-border px-2 py-1">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
