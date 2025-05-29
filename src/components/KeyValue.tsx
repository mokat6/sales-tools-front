import type { JSX } from "react";
import type { CompanyDto } from "../api/SwaggerSdk";

// type keyValueData = Record<string, string | number>;

type KeyValueProps = {
  keyTitle: string;
  valueTitle: string;
  data: CompanyDto | null;
};

export const KeyValue = ({ keyTitle, valueTitle, data }: KeyValueProps) => {
  const entries = Object.entries(data ?? {});

  return (
    <div className="bg-bg-table border border-border rounded  w-88 shadow text-text-body">
      {/* Header row */}
      <div className="flex border-b border-border p-1 font-bold bg-bg-header-row text-text-header-row">
        <div className="basis-35">{keyTitle}</div>
        <div className="flex-1">{valueTitle}</div>
      </div>

      {/* Data rows */}
      {entries.map(([key, value]) => (
        <div className="flex border-b border-border p-1" key={key}>
          <div className=" basis-35">{key}</div>
          <div className="flex-1 ">{formatIfUrl(value)}</div>
        </div>
      ))}
    </div>
  );
};

const formatIfUrl = (value: unknown): JSX.Element | string | number => {
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
  return value;
};
