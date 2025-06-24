import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import React, { useState } from "react";

const PAGE_SIZE = 15;

export const useCompaniesTableDataCursor_infinite = (pageSize: number = PAGE_SIZE) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const { data, fetchNextPage, isLoading, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["companies-infinite-cursor", globalFilter],
    queryFn: ({ pageParam }) =>
      apiClient.getCompaniesCursor({ cursor: pageParam, pageSize: pageSize, search: globalFilter }),
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
    filter: {
      globalFilter,
      setGlobalFilter,
    },
  };
};
