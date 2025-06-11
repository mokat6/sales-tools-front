import type { JSX } from "react";

export type Formatter = (value: unknown) => JSX.Element | string;

const EMPTY_LABEL = "-";

const compClassificationOptions = {
  Unspecified: EMPTY_LABEL,
  GoodMatch: "Good match",
  FuckYou: "Fuck you",
  Ecommerce: "E-commerce",
  GimmeSomeLove: "Gimme Some Love",
} as const;

const formatClassification: Formatter = (value) => {
  return compClassificationOptions[value as keyof typeof compClassificationOptions] ?? String(value);
};

const formatIfUrl: Formatter = (value) => {
  if (typeof value === "string" && value.startsWith("http")) {
    try {
      const url = new URL(value);
      return (
        <a href={url.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {url.hostname}
        </a>
      );
    } catch {
      return value;
    }
  }
  return String(value || "-");
};

const plainText: Formatter = (value) => {
  return String(value);
};

export const formatters = {
  url: formatIfUrl,
  companyClassification: formatClassification,
  plainText,
};
