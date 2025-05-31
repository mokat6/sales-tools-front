import * as SelectRadix from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import React from "react";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function Select({ options, value, onValueChange, placeholder, disabled }: SelectProps) {
  return (
    <SelectRadix.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectRadix.Trigger
        className="inline-flex items-center justify-between rounded px-4 py-2 bg-white text-black border border-gray-300 shadow-sm"
        aria-label="Theme"
      >
        <SelectRadix.Value placeholder={placeholder} />
        <SelectRadix.Icon className="ml-2">
          <ChevronDownIcon />
        </SelectRadix.Icon>
      </SelectRadix.Trigger>

      <SelectRadix.Portal>
        <SelectRadix.Content className="bg-white border border-gray-300 rounded shadow-md">
          <SelectRadix.Viewport className="p-1">
            {options.map((themeOption) => (
              <SelectRadix.Item
                key={themeOption.value}
                value={themeOption.value}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
