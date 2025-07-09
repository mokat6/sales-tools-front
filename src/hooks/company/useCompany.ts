import { keepPreviousData, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { type CompaniesResponseOffset, type ICompaniesResponseCursor } from "../../api/SwaggerSdk";
import { isDefined } from "../../helpers/isDefined";

export default function useCompany(id: number | undefined) {
  const queryClient = useQueryClient();

  if (!id) return;
  // console.log("CompanIES arrays > ", queryClient.getQueriesData<CompaniesResponseOffset>({ queryKey: ["companies"] }));

  const queries = queryClient.getQueriesData<CompaniesResponseOffset>({ queryKey: ["companies"] });

  for (const [, data] of queries) {
    const company = data?.companies?.find((c) => c.id === id);
    if (company) return company;
  }

  return undefined;
}

export function useCompany_InfinityCursor(id: number | undefined) {
  const enabled = isDefined(id);

  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["company-from-cached-list", id],
    queryFn: () => {
      if (!enabled) return Promise.resolve(undefined);

      const queries = queryClient.getQueriesData<InfiniteData<ICompaniesResponseCursor>>({
        queryKey: ["companies-infinite-cursor"],
      });

      for (const [, data] of queries) {
        for (const page of data?.pages ?? []) {
          const company = page.companies?.find((c) => c.id === id);
          if (company) return company;
        }
      }

      return undefined;
    },
    enabled,
    staleTime: Infinity, // we want to keep it forever unless cache is updated
    placeholderData: id ? keepPreviousData : undefined, // need to be defined for smooth row selection, no flash. But needs to be undefined when clearing companyId.
  });
}

// export function useCompany_InfinityCursor(id: number | undefined) {
//   const queryClient = useQueryClient();

//   if (!id) return;
//   // console.log("CompanIES arrays > ", queryClient.getQueriesData<CompaniesResponseOffset>({ queryKey: ["companies"] }));

//   const queries = queryClient.getQueriesData<{ pages: CompaniesResponseCursor[] }>({
//     queryKey: ["companies-infinite-cursor"],
//   });

//   for (const [, data] of queries) {
//     for (const page of data?.pages ?? []) {
//       const company = page.companies?.find((c) => c.id === id);
//       if (company) return company;
//     }
//   }

//   return undefined;
// }
