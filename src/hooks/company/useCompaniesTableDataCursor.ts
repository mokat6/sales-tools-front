import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { useState } from "react";

export type PaginationCursor = {
  totalCount: number; // total number of companies
  nextCursor?: string;
  currentCursor?: string;
  pageSize: number;
  setCursor: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

// useCompanies + TableData
export const useCompaniesTableDataCursor = () => {
  // const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [cursor, setCursor] = useState<string>(); // null = first page

  const { data, isLoading, error } = useQuery({
    queryKey: ["companies-cursor", cursor],
    queryFn: () => apiClient.getCompaniesCursor({ cursor, pageSize }),
    placeholderData: keepPreviousData,
  });

  const pagination: PaginationCursor = {
    totalCount: data?.pagination?.totalCount ?? 666,
    nextCursor: data?.pagination?.nextCursor,
    currentCursor: cursor,
    setCursor,
    pageSize,
    setPageSize,
  };

  return {
    companies: data?.companies ?? [],
    isLoading: isLoading,
    error,
    pagination,
  };
};
