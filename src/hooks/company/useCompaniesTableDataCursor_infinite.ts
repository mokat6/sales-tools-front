import React, { useRef } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import type { CompaniesResponseCursor } from "../../api/SwaggerSdk";
// import { useMasterTableState } from "../zustand/useMasterTableState";
import { useMasterTableStore } from "@/zustand/store1";

export type FetchNextPageFn = UseInfiniteQueryResult<InfiniteData<CompaniesResponseCursor>, Error>["fetchNextPage"];

export type CompaniesInfiniteQueryResult = ReturnType<typeof useCompaniesTableDataCursor_infinite>;

const PAGE_SIZE = 37;

export const useCompaniesTableDataCursor_infinite = () => {
  const isDownloadAllRef = useRef(false);
  // const { globalFilter, sorting } = useMasterTableState();
  const globalFilter = useMasterTableStore((state) => state.globalFilter);
  const sorting = useMasterTableStore((state) => state.sorting);

  const columnSort = sorting[0];

  const { data, fetchNextPage, isLoading, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["companies-infinite-cursor", globalFilter, columnSort?.id, columnSort?.desc],
    queryFn: ({ pageParam }) =>
      apiClient.getCompaniesCursor({
        cursor: pageParam,
        pageSize: PAGE_SIZE,
        search: globalFilter,
        sortBy: columnSort?.id,
        sortDirection: columnSort?.desc ? "desc" : "asc",
        isDownloadAll: isDownloadAllRef.current,
      }),
    initialPageParam: "",
    getNextPageParam: (last) => last.pagination?.nextCursor,
    // refetchOnWindowFocus: false,
    placeholderData: keepPreviousData, // probably needed when changing sorting. and sorting would go into [queryKey]
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  const tableData = React.useMemo(() => data?.pages.flatMap((page) => page.companies ?? []) ?? [], [data]);
  const totalDbRowCount = React.useMemo(() => data?.pages?.[0].pagination?.totalCount ?? 0, [data]);

  const downloadAll = React.useCallback(async () => {
    isDownloadAllRef.current = true;
    await fetchNextPage();
    isDownloadAllRef.current = false;
  }, [fetchNextPage]);

  return {
    tableData,
    totalDbRowCount,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    downloadAll,
  };
};
