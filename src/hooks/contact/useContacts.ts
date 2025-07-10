import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { isDefined } from "../../helpers/isDefined";

export function useContacts(compId: number | undefined) {
  const enabled = isDefined(compId);

  const { data, isLoading } = useQuery({
    queryKey: ["contacts", compId],
    queryFn: () => {
      if (!enabled) return Promise.resolve([]);
      return apiClient.getContacts(compId);
    },
    // placeholderData: compId ? keepPreviousData : undefined, // need to be defined for smooth row selection, no flash. But needs to be undefined when clearing companyId.
    enabled,
  });

  return {
    data,
    isLoading,
  };
}
