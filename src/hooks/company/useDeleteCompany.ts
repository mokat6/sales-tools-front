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

        const updatedPages = data.pages.map((page) => ({
          ...page,
          companies: page.companies?.filter((company) => company.id !== deletedId),
        }));
        console.log("updatedPages > ", updatedPages);
        queryClient.setQueryData(queryKey, { ...data, pages: updatedPages });
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
