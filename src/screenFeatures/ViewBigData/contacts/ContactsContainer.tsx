import { useState } from "react";
import { Select } from "@/components/Select";
import { TextInput } from "@/components/TextInput";
import { useContacts } from "@/hooks/contact/useContacts";
import { ContactTypeDto, type IContactDto } from "@/api/SwaggerSdk.ts";
import { Button } from "@/components/Button.tsx";
import useCreateContact from "@/hooks/contact/useCreateContact.ts";
import { ContactTable } from "./ContactTable.tsx";
import { getContactColumns } from "./columns.tsx";
import useDeleteContact from "@/hooks/contact/useDeleteContact.ts";
import { EditContactModal } from "./EditContactModal.tsx";
import { toast } from "@/components/toast/toastService.ts";
import { isDefined } from "@/helpers/isDefined.ts";

export const contactTypeOptions = [
  { label: "Email", value: ContactTypeDto.Email },
  { label: "Phone", value: ContactTypeDto.PhoneNumber },
  { label: "Facebook", value: ContactTypeDto.Facebook },
  { label: "Instagram", value: ContactTypeDto.Instagram },
  { label: "LinkedIn", value: ContactTypeDto.LinkedIn },
  { label: "Other", value: ContactTypeDto.Other },
];

type ContactsContainerProps = {
  compId: number | undefined;
};

export const ContactsContainer = ({ compId }: ContactsContainerProps) => {
  const [contactType, setContactType] = useState<ContactTypeDto | "">("");
  const [contactValue, setContactValue] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<IContactDto | null>(null);

  const { data, isLoading } = useContacts(compId);

  const mutation = useCreateContact();

  const handleCreateNewContact = () => {
    if (!contactType || contactType === ContactTypeDto.Unspecified || contactValue.trim() === "") {
      toast.info("Please fill out both the contact type and value.");
      return;
    }
    if (!isDefined(compId)) return;

    const newContact = { value: contactValue, companyId: compId, type: contactType };
    mutation.mutate(
      { compId, newContact },
      {
        onSuccess: () => {
          setContactType("");
          setContactValue("");
        },
      }
    );
  };

  const deleteMutate = useDeleteContact();

  const handleEditContact = (contact: IContactDto) => {
    setEditingContact(contact);
    setIsEditModalOpen(true);
  };

  const cols = getContactColumns({ onDeleteContact: deleteMutate.mutate, onEditContact: handleEditContact });

  return (
    <>
      <div className=" w-200 flex flex-col gap-6 text-text-body">
        <div className="flex gap-10">
          <Select
            placeholder="Select..."
            onValueChange={setContactType}
            value={contactType}
            options={contactTypeOptions}
            triggerClassName="min-w-30"
          />
          <TextInput placeholder="Enter value" onChange={setContactValue} value={contactValue} />
          <Button onClick={handleCreateNewContact} disabled={mutation.isPending || !isDefined(compId)}>
            Create
          </Button>
        </div>
        <ContactTable {...{ data, columns: cols, isLoading }} />
      </div>
      {editingContact != null && (
        <EditContactModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} contact={editingContact} />
      )}
    </>
  );
};
