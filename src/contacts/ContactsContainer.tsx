import { useState } from "react";
import { Select } from "../components/Select";
import { TextInput } from "../components/TextInput";
import { useReactTable } from "@tanstack/react-table";
import { MultiSelect } from "../components/MultiSelect";

const options = [
  { label: "Linkedin", value: "1" },
  { label: "Facebook", value: "2" },
  { label: "Twitter", value: "3" },
  { label: "Email", value: "4" },
  { label: "Phone", value: "5" },
];

export const ContactsContainer = () => {
  const [contactType, setContactType] = useState<string>();
  const [contactValue, setContactValue] = useState<string>();

  //   const table = useReactTable({});

  return (
    <div className="bg-amber-400 w-200">
      <div>
        <Select onValueChange={setContactType} options={options} />
        <TextInput placeholder="Enter value" onChange={setContactValue} value={"contactValue"} />
      </div>
      <MultiSelect
        options={options}
        placeholder="lol 1 2"
        onChange={() => console.log("changed")}
        values={["1", "2"]}
      />
    </div>
  );
};
