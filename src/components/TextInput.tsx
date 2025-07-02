type TextInputProps = {
  placeholder: string;
  value: string;
  onChange: (filterValue: string) => void;
};

export const TextInput = ({ placeholder, value, onChange }: TextInputProps) => {
  return <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />;
};
