import type { ColumnDef } from "@tanstack/react-table";
import type { ContactDto } from "../api/SwaggerSdk";
import { formatters } from "../format/formatters";

export const columns: ColumnDef<ContactDto>[] = [
  {
    accessorKey: "type",
    id: "type", // this must be unique among all columns
    header: "Type",
    // accessorFn: (row) => "roll",
    cell: ({ getValue }) => formatters.contactType(getValue()),
    // enableSorting: true,
  },

  {
    accessorKey: "value", // makes `cell: (info) => info.getValue()`  work!
    id: "Identifier",
    header: "Identifier",
    cell: (info) => formatters.simplifyUrl(info.getValue()),
    enableSorting: true,
  },

  {
    accessorKey: "checked", // makes `cell: (info) => info.getValue()`  work!
    id: "Checked",
    header: "Checked",
    cell: (info) => {
      const value = info.getValue();
      return <div className="text-center">{value === true ? "✔" : value === false ? "✘" : "-"}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "isOnWhatsapp", // makes `cell: (info) => info.getValue()`  work!
    id: "onWhatsapp",
    header: "W/A",
    cell: (info) => info.getValue() ?? "-",
    enableSorting: true,
  },
  {
    accessorKey: "contactedFromEmail", // makes `cell: (info) => info.getValue()`  work!
    id: "sentFrom",
    header: "Sent from",
    cell: (info) => info.getValue() ?? "-",
    enableSorting: false,
  },
];
