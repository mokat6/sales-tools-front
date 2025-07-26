import { useTheme } from "@/context/theme/theme-context";
import { themeOptions } from "@/context/theme/themeTypes";
import { Select } from "@/components/Select";

export default function Settings() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="text-text-body p-10 flex gap-20 items-center">
      <p>Theme settings: </p>
      <Select options={themeOptions} value={theme} onValueChange={setTheme} />
    </div>
  );
}
