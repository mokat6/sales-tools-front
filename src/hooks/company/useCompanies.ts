import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";

export default function () {
  return useQuery({
    queryKey: ["companiz"],
    queryFn: apiClient.getCompanies,
  });
}
