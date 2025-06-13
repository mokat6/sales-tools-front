import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";

export default function useCompanies() {
  const response = useQuery({
    queryKey: ["companiz"],
    queryFn: () => apiClient.getCompanies,
    // select: (data) => ({
    //   companies: data.companies ?? [],
    //   totalCount: data.totalCount ?? 0,
    //   page: data.page ?? 1,
    //   pageSize: data.pageSize ?? 12,
    // }),
  });

  return {
    ...response,
    ...response.data,
  };
}
