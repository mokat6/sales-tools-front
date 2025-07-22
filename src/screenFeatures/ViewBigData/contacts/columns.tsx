import type { ColumnDef } from "@tanstack/react-table";
import type { ContactDto } from "@/api/SwaggerSdk";
import { formatters } from "@/format/formatters";
import { RowActions, type ActionButton } from "@/components/RowActions";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

type getContactColumnsProps = {
  onEditContact: (contact: ContactDto) => void;
  onDeleteContact: (contact: ContactDto) => void;
};

export const getContactColumns = ({
  onEditContact,
  onDeleteContact,
}: getContactColumnsProps): ColumnDef<ContactDto>[] => {
  return [
    {
      accessorKey: "type",
      id: "type", // this must be unique among all columns
      header: "Type",
      // accessorFn: (row) => "roll",
      cell: ({ getValue }) => formatters.contactType(getValue()),
      // enableSorting: true,
      enableResizing: true,
    },

    {
      accessorKey: "value", // makes `cell: (info) => info.getValue()`  work!
      id: "Identifier",
      header: "Identifier",
      cell: (info) => formatters.simplifyUrl(info.getValue()),
      enableSorting: true,
      enableResizing: true,
      size: 350,
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
      enableResizing: false,
      size: 75,
    },
    {
      accessorKey: "isOnWhatsapp", // makes `cell: (info) => info.getValue()`  work!
      id: "onWhatsapp",
      header: "W/A",
      cell: (info) => info.getValue() ?? "-",
      enableSorting: true,
      enableResizing: false,
      size: 50,
    },
    {
      accessorKey: "contactedFromEmail", // makes `cell: (info) => info.getValue()`  work!
      id: "sentFrom",
      header: "Sent from",
      cell: (info) => info.getValue() ?? "-",
      enableSorting: false,
    },
    {
      id: "actions",
      // cell: (props) => <RowActions contactId={Number(props.row.id)} companyId={Number(props.row.original.companyId)} />,
      cell: (props) => {
        const contact = props.row.original;
        const actionButtons: ActionButton[] = [
          {
            icon: <Pencil1Icon />,
            label: "Edit",
            onSelect: () => onEditContact(contact),
          },
          {
            icon: <TrashIcon />,
            label: "Delete",
            intent: "danger",
            onSelect: () => onDeleteContact(contact),
          },
        ];

        return <RowActions items={actionButtons} />;
      },
      size: 40,
      enableResizing: false,
    },
  ];
};
