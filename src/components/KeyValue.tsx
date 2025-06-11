import { type Formatter } from "./helpers/formatters";

type KeyValueProps<T> = {
  keyTitle: string;
  valueTitle: string;
  data?: T;
  formatters?: Partial<Record<keyof T, Formatter>>;
};

export const KeyValue = <T extends object>({ keyTitle, valueTitle, data, formatters = {} }: KeyValueProps<T>) => {
  const entries = Object.entries(data ?? {});
  console.log("entr ", entries);
  return (
    <div className="bg-bg-table border border-border rounded  w-88 shadow text-text-body">
      {/* Header row */}
      <div className="flex border-b border-border p-1 font-bold bg-bg-header-row text-text-header-row">
        <div className="basis-35">{keyTitle}</div>
        <div className="flex-1">{valueTitle}</div>
      </div>

      {/* Data rows */}
      {entries.map(([key, value]) => {
        const formatter = formatters[key as keyof T];
        const formattedValue = formatter ? formatter(value) : String(value || "-");
        return (
          <div className="flex border-b border-border p-1" key={key}>
            <div className=" basis-35">{key}</div>
            <div className="flex-1 ">{formattedValue}</div>
          </div>
        );
      })}
    </div>
  );
};
