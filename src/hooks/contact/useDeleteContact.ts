import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { type IContactDto } from "../../api/SwaggerSdk";
import { toast } from "@/components/toast/toastService";

export default function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.deleteContact,

    onMutate: async (delContact: IContactDto) => {
      const queryKey = ["contacts", delContact.companyId];
      await queryClient.cancelQueries({ queryKey });
      const previousContacts = queryClient.getQueryData<IContactDto[]>(queryKey);

      const updatedContacts = previousContacts?.filter((contact) => contact.id !== delContact.id);
      queryClient.setQueryData(queryKey, updatedContacts);

      return { queryKey, previousContacts };
    },
    onSuccess: (data, vars) => {
      toast.success(`Contact deleted - ${vars.value}`);
    },
    onError: (err, vars, context) => {
      toast.danger(`Contact failed to delete ${vars.value}`);
      console.error(`Error deleting contact with id ${vars}: `, err);
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.previousContacts);
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["companiz"] });
    },
  });
}
