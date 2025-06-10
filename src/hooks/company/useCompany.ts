import { useQueryClient } from "@tanstack/react-query";
import type { CompanyDto } from "../../api/SwaggerSdk";

export default function useCompany(id: number | undefined) {
  const queryClient = useQueryClient();

  if (!id) return;

  return queryClient.getQueryData<CompanyDto[]>(["companiz"])?.find((company) => company.id === id);
}
