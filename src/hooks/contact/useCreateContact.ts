import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/ApiClient";
import { type IContactDto, type ICreateContactDto } from "../../api/SwaggerSdk";
import { isDefined } from "../../helpers/isDefined";

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
      console.log("previousQuery >>>> ", previousQuery);

      const tempId = Date.now();
      const updatedContacts = [...(previousQuery ?? []), { ...newContact, id: tempId }];

      queryClient.setQueryData(queryKey, updatedContacts);
      console.log("LOG IS >>>", updatedContacts);

      return { queryKey, previousContacts: previousQuery, tempId };
    },
    onSuccess: (createdContact, _, { queryKey, tempId }) => {
      const prev = queryClient.getQueryData<IContactDto[]>(queryKey);
      if (!prev) return;
      const updatedContacts = prev?.map((contact) => (contact.id === tempId ? createdContact : contact));

      queryClient.setQueryData(queryKey, updatedContacts);
    },
    onError: (err, _newContact, context) => {
      console.error(`Error deleting company with id ${_newContact.companyId}: `, err);
      if (!context) return;
      queryClient.setQueryData(context.queryKey, context.previousContacts);
    },

    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["companiz"] });
    },
  });
}
