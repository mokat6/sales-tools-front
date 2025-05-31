import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";

export default function Tits() {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({ queryKey: ["companiz"], queryFn: apiClient.getCompanies });

  // Mutations
  //   const mutation = useMutation({
  //     mutationFn: postTodo,
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       queryClient.invalidateQueries({ queryKey: ["todos"] });
  //     },
  //   });

  return (
    <>
      <div>Life is hard, but tits are soft</div>

      <ul>
        {query.data?.map((todo) => (
          <li key={todo.id}>
            {todo.city} - {todo.companyName}
          </li>
        ))}
      </ul>
    </>
  );
}
