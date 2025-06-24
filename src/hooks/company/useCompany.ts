import { useQueryClient } from "@tanstack/react-query";
import type { CompaniesResponseCursor, CompaniesResponseOffset } from "../../api/SwaggerSdk";

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
  const queryClient = useQueryClient();

  if (!id) return;
  // console.log("CompanIES arrays > ", queryClient.getQueriesData<CompaniesResponseOffset>({ queryKey: ["companies"] }));

  const queries = queryClient.getQueriesData<{ pages: CompaniesResponseCursor[] }>({
    queryKey: ["companies-infinite-cursor"],
  });

  for (const [, data] of queries) {
    for (const page of data?.pages ?? []) {
      const company = page.companies?.find((c) => c.id === id);
      if (company) return company;
    }
  }

  return undefined;
}
