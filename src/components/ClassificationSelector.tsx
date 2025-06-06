import { Select } from "./Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";
import { CompanyDto } from "../api/SwaggerSdk";
import { compClassificationOptions } from "../api/ApiTypes";

type ClassificationSelectorProps = {
  id: number;
  value: string | null;
  disabled: boolean;
};

const options = Object.entries(compClassificationOptions).map(([key, value]) => ({
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
      body: CompanyDto.fromJS({
        classification: newClassification,
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
