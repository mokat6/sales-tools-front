import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import type { CompanyDto } from "../../api/SwaggerSdk";

export default function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteCompany,

    onMutate: async (deletedId: number) => {
      await queryClient.cancelQueries({ queryKey: ["companiz"] });

      const prevData = queryClient.getQueryData<CompanyDto[]>(["companiz"]);

      queryClient.setQueryData(["companiz"], (old: CompanyDto[]) => old?.filter((c) => c.id !== deletedId));

      return { prevData };
    },

    onError: (err, deletedId, context) => {
      console.error(`Error deleting company with id ${deletedId}: `, err);
      queryClient.setQueryData(["companiz"], context?.prevData);
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["companiz"] });
    },
  });
}
