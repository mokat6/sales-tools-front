import * as SelectRadix from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";

export type SelectOption<T extends string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export interface SelectProps<T extends string> {
  options: SelectOption<T>[];
  value?: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
}

export function Select<T extends string>({
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
  triggerClassName,
  contentClassName,
}: SelectProps<T>) {
  return (
    <SelectRadix.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectRadix.Trigger
        className={`inline-flex items-center justify-between rounded px-4 py-2 bg-bg-table text-text-body border border-border shadow-sm ${triggerClassName}`}
        aria-label="Theme"
      >
        <SelectRadix.Value placeholder={placeholder} />
        <SelectRadix.Icon className="ml-2">
          <ChevronDownIcon />
        </SelectRadix.Icon>
      </SelectRadix.Trigger>

      <SelectRadix.Portal>
        <SelectRadix.Content
          className={`bg-bg-table border border-border rounded shadow-md text-text-body ${contentClassName}`}
        >
          <SelectRadix.Viewport className="p-1">
            {options.map((themeOption) => (
              <SelectRadix.Item
                key={themeOption.value}
                value={themeOption.value}
                className="flex items-center px-4 py-2 hover:bg-bg-row-hover cursor-pointer"
              >
                <SelectRadix.ItemText>{themeOption.label}</SelectRadix.ItemText>
                <SelectRadix.ItemIndicator className="ml-auto">
                  <CheckIcon />
                </SelectRadix.ItemIndicator>
              </SelectRadix.Item>
            ))}
          </SelectRadix.Viewport>
        </SelectRadix.Content>
      </SelectRadix.Portal>
    </SelectRadix.Root>
  );
}
