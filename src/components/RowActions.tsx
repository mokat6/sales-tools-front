import { Button } from "./Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon, TrashIcon, Pencil1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { HamburgerIcon } from "lucide-react";
import useDeleteContact from "../hooks/contact/useDeleteContact";

type RowActionsProps = {
  contactId: number;
  companyId: number;
};

export const RowActions = ({ contactId, companyId }: RowActionsProps) => {
  const deleteContactMutation = useDeleteContact(companyId);

  const handleDelete = () => {
    console.log("delete id -->> ", contactId);
    deleteContactMutation.mutate(contactId);
  };

  const handleEdit = () => {
    console.log("Edit id: ", contactId);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-1 border-border border text-text-header-row hover:bg-bg-row-selected rounded focus:outline-none focus:ring-2 focus:ring-action-primary"
          aria-label="Actions"
        >
          <DotsHorizontalIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-bg-table border border-border text-text-body">
          <DropdownMenu.Item
            className="px-3 py-2 text-sm hover:bg-bg-row-hover cursor-pointer flex items-center gap-2"
            onSelect={handleEdit}
          >
            <Pencil1Icon /> Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="px-3 py-2 text-sm hover:bg-red-100 text-red-600 cursor-pointer flex items-center gap-2"
            onSelect={handleDelete}
            disabled={deleteContactMutation.isPending}
          >
            <TrashIcon /> Delete
          </DropdownMenu.Item>{" "}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  //   return <Button onClick={handler}>Del?</Button>;
};
