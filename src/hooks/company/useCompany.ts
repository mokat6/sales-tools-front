import { useQueryClient } from "@tanstack/react-query";
import type { CompaniesResponseOffset } from "../../api/SwaggerSdk";

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
