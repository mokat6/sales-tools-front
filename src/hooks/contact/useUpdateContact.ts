import { apiClient } from "@/api/ApiClient";
import type { IContactDto } from "@/api/SwaggerSdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.updateContactPut,

    onMutate: async (updatedContact) => {
      const queryKey = ["contacts", updatedContact.companyId];
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<IContactDto[]>(queryKey);

      const updated = prev?.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact));
      queryClient.setQueryData(queryKey, updated);

      return { queryKey, prev };
    },
    onError: (err, vars, context) => {
      console.error(`Error updating contact with id ${vars}: `, err);
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.prev);
    },
    onSuccess: (data) => {
      // TODO: add toast here;
      console.log("data > ", data);
    },
  });
};
