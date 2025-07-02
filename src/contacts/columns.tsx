import type { ColumnDef } from "@tanstack/react-table";
import type { CompanyDto } from "../../api/SwaggerSdk";

export const columns: ColumnDef<CompanyDto>[] = [
  {
    accessorKey: "type", // column id will default to "id"
    id: "type",
    header: "type",
    cell: ({ getValue }) => getValue(), // or row.original.id if needed
    enableSorting: true,
  },

  {
    accessorKey: "companyName", // makes `cell: (info) => info.getValue()`  work!

    id: "CompanyName",
    header: "name",
    footer: (props) => props.column.id,
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
];
