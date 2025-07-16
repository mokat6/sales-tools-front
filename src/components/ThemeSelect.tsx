import { Select } from "./Select";
import { useTheme, type Theme } from "@/context/theme/theme-context";

type optionType = {
  label: string;
  value: Theme;
};

const themeOptions: optionType[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Green", value: "green" },
];

export function ThemeSelect() {
  const { setTheme, theme } = useTheme();

  return <Select options={themeOptions} value={theme} onValueChange={setTheme} />;
}
