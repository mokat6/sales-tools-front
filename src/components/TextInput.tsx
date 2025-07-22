export type TextInputProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  type?: "text" | "email" | "password";
};

export const TextInput = ({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
  type = "text",
}: TextInputProps) => {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`
        w-full rounded-md border bg-bg-table border-border px-3 py-2 text-sm shadow-sm
        focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-action-primary
        disabled:bg-bg-background disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
};
