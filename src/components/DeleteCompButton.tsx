import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";
import { Button } from "./Button";
import type { CompanyDto } from "../api/SwaggerSdk";

type DeleteCompButtonProps = {
  companyId: number | undefined;
};

export default function DeleteCompButton({ companyId }: DeleteCompButtonProps) {
  const queryClient = useQueryClient();

  //  Mutations
  const deleteMutation = useMutation({
    mutationFn: apiClient.deleteCompany,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["companiz"] });
    // },
    onMutate: async (deletedId: number) => {
      await queryClient.cancelQueries({ queryKey: ["companiz"] });

      const prevData = queryClient.getQueryData<CompanyDto[]>(["companiz"]);

      queryClient.setQueryData(["companiz"], (old: CompanyDto[]) => old?.filter((c) => c.id !== deletedId));

      return { prevData };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["companiz"], context?.prevData);
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["companiz"] });
      console.log("done, settled, but don't fetch again");
    },
  });

  const handleOnClick = () => {
    if (!companyId) return;

    console.log("button clicked delete comp id : ", companyId);
    deleteMutation.mutate(companyId);
  };
  return (
    <Button onClick={handleOnClick} disabled={!companyId}>
      Del comp
      {deleteMutation.isPending && <span>Deleting...</span>}
      {deleteMutation.isError && <span>Error deleting company</span>}
    </Button>
  );
}
