import { useState } from "react";
import { Select } from "../components/Select";
import { TextInput } from "../components/TextInput";
import { useContacts } from "../hooks/contact/useContacts";
import { columns } from "./columns.tsx";
import { ContactTypeDto } from "../api/SwaggerSdk.ts";
import { ContactTable } from "./ContactTable.tsx";
import { Button } from "../components/Button.tsx";
import useCreateContact from "../hooks/contact/useCreateContact.ts";

const options = [
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

// const options2 = Object.keys(ContactTypeDto);

export const ContactsContainer = ({ compId }: ContactsContainerProps) => {
  const [contactType, setContactType] = useState<ContactTypeDto>();
  const [contactValue, setContactValue] = useState<string>("");

  const { data } = useContacts(compId);

  // const rows = table.getRowModel().rows;
  console.log("rerender XXXXX" + Math.random() * 1000);
  const mutation = useCreateContact();

  const handleCreateNewContact = () => {
    if (!contactType) return;
    mutation.mutate({ value: contactValue, companyId: compId, type: contactType });
  };

  return (
    <div className=" w-200 flex flex-col gap-6 text-text-body">
      <div className="flex gap-10">
        <Select
          placeholder="Select..."
          onValueChange={setContactType}
          value={contactType}
          options={options}
          className="min-w-30"
        />
        <TextInput placeholder="Enter value" onChange={setContactValue} value={contactValue} />
        <Button onClick={handleCreateNewContact}>Create</Button>
      </div>
      <ContactTable {...{ data, columns }} />
    </div>
  );
};
