import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { type IContactDto } from "../../api/SwaggerSdk";
import { toast } from "@/components/toast/toastService";

export default function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.deleteContact,

    onMutate: async ({ compId, contactId }: { compId: number; contactId: number; contactValue?: string }) => {
      const queryKey = ["contacts", compId];
      await queryClient.cancelQueries({ queryKey });
      const previousContacts = queryClient.getQueryData<IContactDto[]>(queryKey);
      const updatedContacts = previousContacts?.filter((contact) => contact.id !== contactId);
      queryClient.setQueryData(queryKey, updatedContacts);
      return { queryKey, previousContacts };
    },
    onSuccess: (_, vars) => {
      toast.success(`Contact deleted - ${vars.contactValue}`);
    },
    onError: (err, vars, context) => {
      toast.danger(`Contact failed to delete ${vars.contactValue}`);
      console.error(`Error deleting contact ${vars}: `, err);
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.previousContacts);
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["companiz"] });
    },
  });
}
