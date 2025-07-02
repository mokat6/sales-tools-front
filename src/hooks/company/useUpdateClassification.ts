import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { CompanyDto, type ICompaniesResponseCursor, type ICompaniesResponseOffset } from "../../api/SwaggerSdk";

export default function () {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.patchCompany,
    onMutate: async ({ compId, body }) => {
      await queryClient.cancelQueries({ queryKey: ["companies"] });

      const previousPages = queryClient.getQueriesData<ICompaniesResponseOffset>({
        queryKey: ["companies-infinite-cursor"],
      });

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

export function useUpdateClassification_infinityCursor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.patchCompany,
    onMutate: async ({ compId, body }) => {
      await queryClient.cancelQueries({ queryKey: ["companies-infinite-cursor"] });

      const previousQueries = queryClient.getQueriesData<InfiniteData<ICompaniesResponseCursor>>({
        queryKey: ["companies-infinite-cursor"],
      });

      const touchedQueries: {
        queryKey: readonly unknown[];
        previousData: InfiniteData<ICompaniesResponseCursor>;
      }[] = [];

      for (const [queryKey, data] of previousQueries) {
        if (!data) continue;

        const companyFound = data.pages.some((page) => page.companies?.some((c) => c.id === compId));
        if (!companyFound) continue;
        touchedQueries.push({ queryKey, previousData: data });

        const updatedPages = data.pages.map((page) => {
          const hasCompany = page.companies?.some((c) => c.id === compId);
          if (!hasCompany) return page;

          return {
            ...page,
            companies: page.companies?.map((c) => (c.id === compId ? CompanyDto.fromJS({ ...c, ...body }) : c)),
          };
        });

        queryClient.setQueryData(queryKey, {
          ...data,
          pages: updatedPages,
        });
      }
      return { touchedQueries };
    },

    onError: (_err, variables, context) => {
      console.error(`Failed updating classification on comp id ${variables.compId} : `, _err);
      if (!context?.touchedQueries) return;

      for (const { queryKey, previousData } of context.touchedQueries) {
        queryClient.setQueryData(queryKey, previousData);
      }
    },
    onSuccess: (returnedCompany, variables) => {
      console.log("classification update success: ", returnedCompany);
      // queryClient.setQueryData   ... update with returnedCompany if needed
      queryClient.invalidateQueries({ queryKey: ["company-from-cached-list", variables.compId] });
    },
  });
}
