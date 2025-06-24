import type { ColumnDef } from "@tanstack/react-table";
import type { CompanyDto } from "../../api/SwaggerSdk";

export const columns: ColumnDef<CompanyDto>[] = [
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
