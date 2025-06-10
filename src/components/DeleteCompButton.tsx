import { Button } from "./Button";
import useDeleteCompany from "../hooks/company/useDeleteCompany";

type DeleteCompButtonProps = {
  companyId: number | undefined;
};

export default function DeleteCompButton({ companyId }: DeleteCompButtonProps) {
  const deleteMutation = useDeleteCompany();

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
