import { useEffect, useState } from "react";
import { Select } from "./Select";

const themeOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Green", value: "green" },
];

export function ThemeSelect() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    console.log("up in Paris: ", storedTheme);
    if (storedTheme) return storedTheme;

    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isSystemDark ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.className = "";
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <Select options={themeOptions} value={theme} onValueChange={setTheme} />;
}
