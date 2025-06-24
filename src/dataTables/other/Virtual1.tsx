import React from "react";
import { useCompaniesTableDataCursor_infinite } from "../../hooks/company/useCompaniesTableDataCursor_infinite";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function Virtual1() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } = useCompaniesTableDataCursor_infinite(13);
  const flatData = React.useMemo(() => data?.pages.flatMap((page) => page.companies ?? []) ?? [], [data]);
  return (
    <div className="w-150 bg-bg-table">
      asdf
      <table style={{ display: "grid", height: 200, overflow: "auto" }}>
        <tbody
          style={{
            display: "grid",
            height: 500, //tells scrollbar how big the table is
            position: "relative", //needed for absolute positioning of rows
          }}
        >
          <tr
            style={{
              position: "absolute",
              transform: `translateY(100px)`, //this should always be a `style` as it changes on scroll
              width: "100%",
            }}
          >
            <td>asd</td>
          </tr>
          <tr>
            <td>asd</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
