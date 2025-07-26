import { Button } from "../../components/Button";
import useDeleteCompany from "../../hooks/company/useDeleteCompany";

type DeleteCompButtonProps = {
  companyId: number | undefined;
  reselectRowAfterDelete: () => void;
};

export default function DeleteCompButton({ companyId, reselectRowAfterDelete }: DeleteCompButtonProps) {
  const deleteMutation = useDeleteCompany();

  const handleOnClick = () => {
    if (!companyId) return;

    console.log("button clicked delete comp id : ", companyId);
    deleteMutation.mutate(companyId, {
      onSuccess: () => reselectRowAfterDelete(),
    });
  };
  return (
    <Button onClick={handleOnClick} disabled={!companyId}>
      Del comp
      {deleteMutation.isPending && <span>Deleting...</span>}
      {deleteMutation.isError && <span>Error deleting company</span>}
    </Button>
  );
}
