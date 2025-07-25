import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { type IContactDto, type ICreateContactDto } from "../../api/SwaggerSdk";
import { isDefined } from "../../helpers/isDefined";
import { toast } from "@/components/toast/toastService";

export default function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.createContact,

    onMutate: async (newContact: ICreateContactDto) => {
      const queryKey = ["contacts", newContact.companyId];
      await queryClient.cancelQueries({ queryKey });

      const compId = newContact.companyId;
      if (!isDefined(compId)) return;

      const previousQuery = queryClient.getQueryData<IContactDto[]>(queryKey);

      const tempId = Date.now();
      const updatedContacts = [...(previousQuery ?? []), { ...newContact, id: tempId }];

      queryClient.setQueryData(queryKey, updatedContacts);

      return { queryKey, previousContacts: previousQuery, tempId };
    },
    onSuccess: (createdContact, _, { queryKey, tempId }) => {
      toast.success(`Contact created - ${createdContact.value}`);
      const prev = queryClient.getQueryData<IContactDto[]>(queryKey);
      if (!prev) return;
      const updatedContacts = prev?.map((contact) => (contact.id === tempId ? createdContact : contact));

      queryClient.setQueryData(queryKey, updatedContacts);
    },
    onError: (err, _newContact, context) => {
      toast.danger(`Creating contact failed - ${_newContact.value}, Error: ${err.message}`);
      console.error(`Error deleting company with id ${_newContact.companyId}: `, err);
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.previousContacts);
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["companiz"] });
    },
  });
}
