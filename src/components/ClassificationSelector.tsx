import { Select } from "./Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/ApiClient";
import { CompanyDto, CompClassificationDto, type ICompanyDto } from "../api/SwaggerSdk";
import { compClassificationOptions } from "../api/ApiTypes";

type ClassificationSelectorProps = {
  id: number;
  value?: CompClassificationDto;
  disabled: boolean;
};

const options = Object.entries(compClassificationOptions).map(([key, value]) => ({
  label: value,
  value: (key as CompClassificationDto) ?? CompClassificationDto.Unspecified,
}));

export default function ClassificationSelector({ id, value, disabled }: ClassificationSelectorProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: apiClient.patchCompany,
    onMutate: async ({ compId, body }) => {
      await queryClient.cancelQueries({ queryKey: ["companiz"] });

      const previousCompanies = queryClient.getQueryData<CompanyDto[]>(["companiz"]);
      console.log("BODY ", body);
      queryClient.setQueryData<CompanyDto[]>(["companiz"], (old) => {
        return old?.map((company) => (company.id === compId ? ({ ...company, ...body } as CompanyDto) : company));
      });

      return { previousCompanies };
    },
    onError: (_err, variables, context) => {
      // if (context?.previousCompanies) {
      //   queryClient.setQueryData(["companiz", variables.compId]);
      // }
    },
    onSuccess: (x) => {
      console.log("XX: ", x);
      console.log("on success classification selector");
      // queryClient.invalidateQueries({ queryKey: ["companiz"] });

      // setTimeout(() => {
      //   queryClient.invalidateQueries({ queryKey: ["companiz"] });
      // }, 1000); // 1 second delay before refetch
    },
  });

  const onValueChange = (newClassification: CompClassificationDto) => {
    console.log("new option valye", newClassification);
    mutation.mutate({
      compId: id,
      body: {
        classification: newClassification,
      },
    });
  };

  console.log("disbaled > ", disabled);
  return (
    <div>
      <Select className="min-w-50" disabled={disabled} onValueChange={onValueChange} value={value} options={options} />
    </div>
  );
}
