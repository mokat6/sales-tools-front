import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import type { CompanyDto } from "../../api/SwaggerSdk";

export default function () {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.patchCompany,
    onMutate: async ({ compId, body }) => {
      await queryClient.cancelQueries({ queryKey: ["companiz"] });

      const previousCompanies = queryClient.getQueryData<CompanyDto[]>(["companiz"]);
      console.log("BODY ", body);
      queryClient.setQueryData<CompanyDto[]>(["companiz"], (old) => {
        return old?.map((company) => (company.id === compId ? ({ ...company, ...body } as CompanyDto) : company));
      });

      return { previousCompanies };
    },
    onError: (_err, variables, context) => {
      console.log("Optimistic update failed: ", _err);
      const previous = context?.previousCompanies;
      if (!previous) return;

      queryClient.setQueryData(["companiz"], previous);
    },
    onSuccess: (returnedCompany) => {
      console.log("classification update success: ", returnedCompany);
      // queryClient.setQueryData   ... update with returnedCompany if needed
    },
  });
}
