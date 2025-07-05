import { useMemo, useState } from "react";
import { Select } from "../components/Select";
import { TextInput } from "../components/TextInput";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MultiSelect } from "../components/MultiSelect";
import { useContacts } from "../hooks/contact/useContacts";
import { columns } from "./columns.tsx";
import type { ContactDto } from "../api/SwaggerSdk.ts";
import { ContactTable } from "./ContactTable.tsx";

const options = [
  { label: "Linkedin", value: "1" },
  { label: "Facebook", value: "2" },
  { label: "Twitter", value: "3" },
  { label: "Email", value: "4" },
  { label: "Phone", value: "5" },
];

type ContactsContainerProps = {
  compId: number;
};

export const ContactsContainer = ({ compId }: ContactsContainerProps) => {
  const [contactType, setContactType] = useState<string>();
  const [contactValue, setContactValue] = useState<string>("");

  //   const table = useReactTable({});
  const { data, isLoading } = useContacts(compId);

  // Data has to be memoized or else - infinite loop
  // if ((isLoading, !data)) return <div>Loading...</div>;

  // const rows = table.getRowModel().rows;
  console.log("rerender XXXXX" + Math.random() * 1000);

  // console.log("contacts DATA >> ", data);

  return (
    <div className=" w-200 flex flex-col gap-6">
      <div className="flex gap-10">
        <Select onValueChange={setContactType} options={options} className="min-w-30" />
        <TextInput placeholder="Enter value" onChange={setContactValue} value={contactValue} />
      </div>
      <ContactTable {...{ data, columns }} />
      <div onClick={() => console.log()}>div 1</div>
      <div>div 2</div>
    </div>
  );
};
