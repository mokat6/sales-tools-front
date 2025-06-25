import type { ColumnDef } from "@tanstack/react-table";
import type { CompanyDto } from "../../api/SwaggerSdk";

export const columns: ColumnDef<CompanyDto>[] = [
  {
    accessorKey: "id", // column id will default to "id"
    id: "Id",
    header: "id",
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
