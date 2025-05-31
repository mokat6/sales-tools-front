import { Select } from "./Select";
import { CompClassificationLabels, stringToCompClassification } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";
import { PatchCompanyDto } from "../api/SwaggerSdk";

type ClassificationSelectorProps = {
  id: number;
  value: string | null;
  disabled: boolean;
};

const options = Object.entries(CompClassificationLabels).map(([key, value]) => ({
  label: value,
  value: key,
}));

export default function ClassificationSelector({ id, value, disabled }: ClassificationSelectorProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: apiClient.patchCompany,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["companiz", id] });
      queryClient.invalidateQueries({ queryKey: ["companiz"] });
    },
  });

  const onValueChange = (newClassification: string) => {
    mutation.mutate({
      compId: id,
      body: PatchCompanyDto.fromJS({
        classification: stringToCompClassification(newClassification),
      }),
    });
  };

  console.log("disbaled > ", disabled);
  return (
    <div>
      <Select disabled={disabled} onValueChange={onValueChange} value={value ?? ""} options={options} />
    </div>
  );
}
