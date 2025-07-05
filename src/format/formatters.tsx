import type { JSX } from "react";

export type Formatter = (value: unknown) => JSX.Element | string;

const EMPTY_LABEL = "-";

const compClassificationOptions = {
  Unspecified: EMPTY_LABEL,
  GoodMatch: "Good match",
  Maybe: "Maybe",
  Ecommerce: "E-commerce",
  GimmeSomeLove: "Gimme Some Love",
} as const;

const formatClassification = (value: string) => {
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
  return String(value || "-");
};

const contactTypeFormat: Record<string, string> = {
  PhoneNumber: "Phone",
  Email: "Email",
  Facebook: "FB",
  Instagram: "In",
  LinkedIn: "Lin",
  Twitter: "Tw",
  Other: "Other",
};

const contactType = (key: unknown) => {
  if (typeof key !== "string") return "Other";
  return contactTypeFormat[key] ?? key;
};

function urlMinusHttp(url: unknown): string {
  if (typeof url !== "string") return "";
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

const simplifyUrl: Formatter = (value) => {
  if (typeof value === "string") {
    // Skip emails or phone numbers
    if (value.includes("@") || /^\+?\d+$/.test(value.replace(/\s+/g, ""))) {
      return value;
    }

    let url: URL;
    try {
      // Try with original
      url = new URL(value);
    } catch {
      try {
        // If it fails, try prepending https://
        url = new URL("https://" + value);
      } catch {
        return value; // Not a valid URL
      }
    }

    const simplified = urlMinusHttp(value);
    return (
      <a href={url.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
        {simplified}
      </a>
    );
  }

  return String(value || "-");
};

export const formatters = {
  url: formatIfUrl,
  companyClassification: formatClassification,
  plainText,
  contactType,
  simplifyUrl,
};
