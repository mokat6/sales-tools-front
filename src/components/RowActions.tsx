import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { cva, type VariantProps } from "class-variance-authority";

export interface ActionButton extends VariantProps<typeof rowActionsCva> {
  label: string;
  icon: React.ReactNode;
  onSelect: (event: Event) => void;
}

interface RowActionsProps {
  items: ActionButton[];
}

const rowActionsCva = cva("px-3 py-2 text-sm cursor-pointer flex items-center gap-2", {
  variants: {
    intent: {
      primary: "hover:bg-bg-row-hover",
      danger: "hover:bg-danger-100 text-danger-500",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export const RowActions = ({ items }: RowActionsProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-1 border-border border text-text-header-row hover:bg-bg-row-selected rounded focus:outline-none focus:ring-2 focus:ring-action-primary"
          aria-label="Actions"
        >
          <DotsHorizontalIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-bg-table border border-border text-text-body">
          {items.map(({ intent, label, icon, onSelect }, index) => (
            <DropdownMenu.Item key={index} className={rowActionsCva({ intent })} onSelect={onSelect}>
              {icon} {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
