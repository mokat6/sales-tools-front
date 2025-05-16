import * as React from "react";
import * as Select from "@radix-ui/react-select";
// import classNames from 'classnames';
// import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '@radix-ui/react-icons';

const options = ["light", "dark", "green"];

const ThemeSelect = () => {
  const [value, setValue] = React.useState("light");

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger className="inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none text-black shadow hover:bg-gray-100 outline-none">
        <Select.Value placeholder="Select theme…" />
        <Select.Icon>{/* <ChevronDownIcon /> */}</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-md bg-white shadow-md">
          <Select.ScrollUpButton className="flex h-[25px] items-center justify-center bg-white text-black">
            {/* <ChevronUpIcon /> */}
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[25px] items-center justify-center bg-white text-black">
            {/* <ChevronDownIcon /> */}
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

// ✅ Add proper types for props and ref
const SelectItem = React.forwardRef<HTMLDivElement, Select.SelectItemProps & { className?: string }>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={`
          "relative flex h-[25px] select-none items-center rounded pl-[25px] pr-[35px] text-[13px] leading-none text-black data-[highlighted]:bg-gray-200 data-[highlighted]:text-black",
          ${className}`}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          {/* <CheckIcon /> */}
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);
SelectItem.displayName = "SelectItem";

export default ThemeSelect;
