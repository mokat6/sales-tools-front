import { useState } from "react";
import { Spinner } from "../components/Spinner";
import ViewBigDataContent from "./ViewBigDataContent";
import { useCompaniesTableDataCursor_infinite } from "../hooks/company/useCompaniesTableDataCursor_infinite";
import type { SortingState } from "@tanstack/react-table";

const PAGE_SIZE = 37;

function ViewBigData() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { isLoading, ...fetchRest } = useCompaniesTableDataCursor_infinite({
    pageSize: PAGE_SIZE,
    columnSort: sorting[0],
    globalFilter,
  });

  //

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );

  console.log("Rendering +++++++ .... Loader Screen");
  return (
    <>
      <ViewBigDataContent {...{ ...fetchRest, globalFilter, setGlobalFilter, sorting, setSorting }} />
    </>
  );
}

export default ViewBigData;
