import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon } from "@radix-ui/react-icons";

export type SelectOption<T extends string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

interface MultiSelectProps<T extends string> {
  options: SelectOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  placeholder?: string;
}

export function MultiSelect<T extends string>({
  options,
  values,
  onChange,
  placeholder = "Select...",
}: MultiSelectProps<T>) {
  const toggleValue = (value: T) => {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex items-center px-4 py-2 border rounded bg-white">
        {values.length > 0
          ? options
              .filter((opt) => values.includes(opt.value))
              .map((o) => o.label)
              .join(", ")
          : placeholder}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-white border rounded shadow-md p-1">
        {options.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            onSelect={() => toggleValue(option.value)}
            className="flex items-center px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
            disabled={option.disabled}
          >
            <span>{option.label}</span>
            {values.includes(option.value) && <CheckIcon className="ml-auto text-green-600" />}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
