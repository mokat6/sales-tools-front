import { useTheme } from "@/context/theme/theme-context";
import { themeOptions } from "@/context/theme/themeTypes";
import { Select } from "@/components/Select";

export default function Settings() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="text-text-body">
      settings here
      <Select options={themeOptions} value={theme} onValueChange={setTheme} />
    </div>
  );
}
