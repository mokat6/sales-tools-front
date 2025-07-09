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
    getRowId: (row) => {
      if (row.id === undefined) throw new Error("row.id is undefined/null, set up in useReactTable({}) options obj");
      return row.id.toString();
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <table className="border w-full border-border text-text-body" style={{ width: table.getCenterTotalSize() }}>
      <thead className="bg-bg-header-row">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className=" px-2 py-1 text-left cursor-pointer hover:bg-bg-header-hover relative group"
                style={{ width: header.getSize() }}
                aria-sort={
                  header.column.getIsSorted()
                    ? header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <div
                  onClick={header.column.getToggleSortingHandler()}
                  className="flex items-center gap-1 text-text-header-row select-none"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() &&
                    ({
                      asc: <ArrowUp size={14} className="text-action-primary" />,
                      desc: <ArrowDown size={14} className="text-action-primary" />,
                    }[header.column.getIsSorted() as string] ?? (
                      <ArrowUpDown size={14} className="text-text-header-row" />
                    ))}
                </div>

                {/* Resize hand */}
                {header.column.getCanResize() && (
                  <div
                    className={`absolute top-0  h-full w-1 right-0  cursor-col-resize select-none touch-none 
                    ${header.column.getIsResizing() ? "bg-action-primary" : "bg-black/50"}
                    opacity-0 group-hover:opacity-100`}
                    {...{
                      onDoubleClick: () => header.column.resetSize(),
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      // className: `
                      // bg-red-400 `,
                    }}
                  />
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="bg-bg-table">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-bg-row-hover">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border-t border-border px-2 py-1" style={{ width: cell.column.getSize() }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
