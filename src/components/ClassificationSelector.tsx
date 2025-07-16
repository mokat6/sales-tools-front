import { CompClassificationDto } from "../api/SwaggerSdk";
import { usePatchCompanyInfinite } from "../hooks/company/usePatchCompany";
import { MultiSelect } from "./MultiSelect";
import { formatters } from "../format/formatters";
import { isDefined } from "../helpers/isDefined";

type ClassificationSelectorProps = {
  id?: number;
  value?: CompClassificationDto[];
  disabled?: boolean;
};

const options = Object.entries(CompClassificationDto)
  .filter(([key]) => key !== "Unspecified")
  .map(([key, value]) => ({
    label: formatters.companyClassification(value),
    value: key as CompClassificationDto,
  }));

export default function ClassificationSelector({ id, value }: ClassificationSelectorProps) {
  const mutation = usePatchCompanyInfinite();

  const onValueChange = (newValues: CompClassificationDto[]) => {
    if (!isDefined(id)) return;

    mutation.mutate({
      compId: id,
      body: {
        classification: newValues,
      },
    });
  };

  return (
    <div className="w-50 h-30">
      <MultiSelect options={options} onChange={onValueChange} placeholder="Select..." values={value ?? []} />
    </div>
  );
}
