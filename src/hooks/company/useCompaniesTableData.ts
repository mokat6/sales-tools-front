import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { useState } from "react";

export type Pagination = {
  totalCount: number; // total number of companies
  pageIndex: number;
  pageSize: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

// useCompanies + TableData
export const useCompaniesTableData = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["companies", pageIndex, pageSize],
    queryFn: () => apiClient.getCompanies({ pageIndex: pageIndex, pageSize: pageSize }),
    placeholderData: keepPreviousData,
  });

  const pagination: Pagination = {
    totalCount: data?.pagination?.totalCount ?? 1,
    // use local pageIndex, pageSize values, not the server ones! Server values for debug.
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
  };

  return {
    companies: data?.companies ?? [],
    isLoading: isLoading || isFetching,
    error,
    pagination,
  };
};
