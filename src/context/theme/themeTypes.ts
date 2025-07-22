import type { Theme } from "./theme-context";

type optionType = {
  label: string;
  value: Theme;
};

export const themeOptions: optionType[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Green", value: "green" },
];
