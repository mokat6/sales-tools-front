type KeyValueProps = {
  keyTitle: string;
  valueTitle: string;
  data?: Record<string, string | React.ReactNode>;
};

export const KeyValue = ({ keyTitle, valueTitle, data }: KeyValueProps) => {
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
        return (
          <div className="flex border-b border-border p-1" key={key}>
            <div className=" basis-35">{key}</div>
            <div className="flex-1 ">{value}</div>
          </div>
        );
      })}
    </div>
  );
};
