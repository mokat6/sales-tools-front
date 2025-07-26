import { Button } from "../../components/Button";
import useDeleteCompany from "../../hooks/company/useDeleteCompany";

type DeleteCompButtonProps = {
  companyId: number | undefined;
  reselectRowAfterDelete?: (rowIndex?: number) => void;
  getRowIndex?: () => number | undefined;
};

export default function DeleteCompButton({ companyId, reselectRowAfterDelete, getRowIndex }: DeleteCompButtonProps) {
  const deleteMutation = useDeleteCompany();

  const handleOnClick = () => {
    if (!companyId) return;
    const selectedRowIndex = getRowIndex?.();
    console.log("button clicked delete comp id : ", companyId);
    deleteMutation.mutate(companyId, {
      onSuccess: () => {
        reselectRowAfterDelete?.(selectedRowIndex);
      },
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
