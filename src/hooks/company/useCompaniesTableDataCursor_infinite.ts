import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import React from "react";
import type { ColumnSort } from "@tanstack/react-table";

type useCompaniesTableDataCursor_infiniteProps = {
  pageSize?: number;
  globalFilter?: string;
  columnSort?: ColumnSort;
};

export const useCompaniesTableDataCursor_infinite = ({
  pageSize,
  globalFilter,
  columnSort,
}: useCompaniesTableDataCursor_infiniteProps) => {
  const { data, fetchNextPage, isLoading, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["companies-infinite-cursor", globalFilter, columnSort?.id, columnSort?.desc],
    queryFn: ({ pageParam }) =>
      apiClient.getCompaniesCursor({
        cursor: pageParam,
        pageSize: pageSize,
        search: globalFilter,
        sortBy: columnSort?.id,
        sortDirection: columnSort?.desc ? "desc" : "asc",
      }),
    initialPageParam: "",
    getNextPageParam: (last) => last.pagination?.nextCursor,
    // refetchOnWindowFocus: false,
    placeholderData: keepPreviousData, // probably needed when changing sorting. and sorting would go into [queryKey]
  });

  const flatData = React.useMemo(() => data?.pages.flatMap((page) => page.companies ?? []) ?? [], [data]);
  const totalDbRowCount = React.useMemo(() => data?.pages?.[0].pagination?.totalCount ?? 0, [data]);

  return {
    companies: flatData,
    totalDbRowCount,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  };
};
