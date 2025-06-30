import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import type { ICompaniesResponseCursor } from "../../api/SwaggerSdk";

export default function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteCompany,

    onMutate: async (deletedId: number) => {
      await queryClient.cancelQueries({ queryKey: ["companies-infinite-cursor"] });

      const previousQueries = queryClient.getQueriesData<InfiniteData<ICompaniesResponseCursor>>({
        queryKey: ["companies-infinite-cursor"],
      });

      for (const [queryKey, data] of previousQueries) {
        if (!data) continue;

        // Check if any page contains the company to be deleted
        const companyFound = data.pages.some((page) => page.companies?.some((c) => c.id === deletedId));

        if (!companyFound) continue;

        const updatedPages = data.pages.map((page, index) => ({
          ...page,
          companies: page.companies?.filter((company) => company.id !== deletedId),
          pagination:
            index === 0
              ? {
                  ...page.pagination,
                  totalCount: Math.max(0, (page.pagination?.totalCount ?? 0) - 1),
                }
              : page.pagination,
        }));

        queryClient.setQueryData(queryKey, {
          ...data,
          pages: updatedPages,
        });
      }

      return { previousData: previousQueries, queryKey: ["companies-infinite-cursor"] };
    },
    onSuccess: () => {},
    // (context), third arg.
    onError: (err, deletedId) => {
      console.error(`Error deleting company with id ${deletedId}: `, err);
      // queryClient.setQueryData(["companiz"], context?.prevData);
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["companiz"] });
    },
  });
}
