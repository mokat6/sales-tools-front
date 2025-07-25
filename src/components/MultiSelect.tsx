import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import * as RovingFocusGroup from "@radix-ui/react-roving-focus";
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
  disabled?: boolean;
}

export function MultiSelect<T extends string>({
  options,
  values,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (val: T) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          disabled={disabled}
          className="inline-flex flex-wrap bg-bg-table items-center gap-1 px-3 py-2 border border-border rounded w-full text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[38px]"
          type="button"
        >
          {values.length > 0 ? (
            values.map((val) => {
              const option = options.find((o) => o.value === val);
              if (!option) return null;
              return (
                <span
                  key={val}
                  className="flex items-center gap-1 bg-bg-row-selected text-text-body rounded-full px-2 py-0.5 text-xs"
                >
                  {option.label}
                  <span
                    role="button"
                    className="ml-1 text-action-primary hover:text-text-body"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent popover toggle
                      toggleValue(val);
                    }}
                    aria-label={`Remove ${option.label}`}
                  >
                    ×
                  </span>
                </span>
              );
            })
          ) : (
            <span className="text-text-header-row">{placeholder}</span>
          )}

          {/* Add a caret icon at the end */}
          <svg
            className="ml-auto h-4 w-4 opacity-50 text-text-body"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        sideOffset={4}
        className="z-z-popover w-[200px] max-h-[250px] overflow-auto rounded bg-bg-table border border-border shadow-md p-1"
      >
        <RovingFocusGroup.Root orientation="vertical">
          {options.map((option) => {
            const checked = values.includes(option.value);
            return (
              <RovingFocusGroup.Item key={option.value} asChild>
                <button
                  onClick={() => toggleValue(option.value)}
                  disabled={option.disabled}
                  className={`
                    flex w-full items-center justify-between px-2 py-1.5 rounded text-sm text-text-body
                    ${checked ? "bg-bg-row-selected" : "hover:bg-bg-row-hover"}
                    ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <span>{option.label}</span>
                  {checked && <CheckIcon className="w-4 h-4" />}
                </button>
              </RovingFocusGroup.Item>
            );
          })}
        </RovingFocusGroup.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
