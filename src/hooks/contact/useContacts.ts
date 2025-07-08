import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";

export function useContacts(compId: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["contacts", compId],
    queryFn: () => apiClient.getContacts(compId),
    placeholderData: compId ? keepPreviousData : undefined, // need to be defined for smooth row selection, no flash. But needs to be undefined when clearing companyId.
  });

  return {
    data: data ?? [],
    isLoading,
  };
}
