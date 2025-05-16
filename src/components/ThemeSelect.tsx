// ThemeSelect.tsx
import * as Select from "@radix-ui/react-select";
// import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import React from "react";

export function ThemeSelect() {
  const [theme, setTheme] = React.useState("light");

  return (
    <Select.Root value={theme} onValueChange={setTheme}>
      <Select.Trigger
        className="inline-flex items-center justify-between rounded px-4 py-2 bg-white text-black border border-gray-300 shadow-sm"
        aria-label="Theme"
      >
        <Select.Value placeholder="Select theme" />
        <Select.Icon className="ml-2">{/* <ChevronDownIcon /> */}</Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="bg-white border border-gray-300 rounded shadow-md">
          <Select.Viewport className="p-1">
            {["light", "dark", "green"].map((themeOption) => (
              <Select.Item
                key={themeOption}
                value={themeOption}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <Select.ItemText>{themeOption}</Select.ItemText>
                <Select.ItemIndicator className="ml-auto">{/* <CheckIcon /> */}</Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
