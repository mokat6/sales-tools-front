import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Tits from "./Tits";

const queryClient = new QueryClient();

export default function TanstackQuery() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tits />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
