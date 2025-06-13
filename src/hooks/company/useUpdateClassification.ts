import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { CompanyDto, type ICompaniesResponseOffset } from "../../api/SwaggerSdk";

export default function () {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.patchCompany,
    onMutate: async ({ compId, body }) => {
      await queryClient.cancelQueries({ queryKey: ["companies"] });

      const previousPages = queryClient.getQueriesData<ICompaniesResponseOffset>({ queryKey: ["companies"] });

      for (const [queryKey, pageData] of previousPages) {
        if (!pageData?.companies) continue;

        const hasCompany = pageData.companies.some((company) => company.id === compId);
        if (!hasCompany) continue;

        const updatedCompanies = pageData.companies?.map((company) =>
          company.id === compId ? CompanyDto.fromJS({ ...company, ...body }) : company
        );

        queryClient.setQueryData<ICompaniesResponseOffset>(queryKey, (old) => {
          return {
            ...old,
            companies: updatedCompanies,
          };
        });

        return { previousData: pageData, queryKey };
      }
    },

    onError: (_err, variables, context) => {
      console.error(`Failed updating classification on comp id ${variables.compId} : `, _err);
      if (!context?.previousData || !context.queryKey) return;

      queryClient.setQueryData<ICompaniesResponseOffset>(context.queryKey, context.previousData);
    },
    onSuccess: (returnedCompany) => {
      console.log("classification update success: ", returnedCompany);
      // queryClient.setQueryData   ... update with returnedCompany if needed
    },
  });
}
