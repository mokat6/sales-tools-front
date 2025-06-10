import { Select } from "./Select";
import { CompClassificationDto } from "../api/SwaggerSdk";
import { compClassificationOptions } from "../api/ApiTypes";
import useUpdateClassification from "../hooks/company/useUpdateClassification";

type ClassificationSelectorProps = {
  id?: number;
  value?: CompClassificationDto;
  disabled?: boolean;
};

const options = Object.entries(compClassificationOptions).map(([key, value]) => ({
  label: value,
  value: (key as CompClassificationDto) ?? CompClassificationDto.Unspecified,
}));

export default function ClassificationSelector({ id, value }: ClassificationSelectorProps) {
  const mutation = useUpdateClassification();

  const onValueChange = (newClassification: CompClassificationDto) => {
    console.log("new option valye", newClassification);
    if (!id) return;

    mutation.mutate({
      compId: id,
      body: {
        classification: newClassification,
      },
    });
  };

  return (
    <div>
      <Select
        className="min-w-50"
        disabled={!value || !id}
        onValueChange={onValueChange}
        value={value ?? CompClassificationDto.Unspecified}
        options={options}
      />
    </div>
  );
}
