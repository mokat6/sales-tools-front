import { Select } from "./Select";
import { CompClassification } from "../api/SwaggerSdk";

type ClassificationSelectorProps = {
  id: string | number;
  value: string | null;
};

export default function ClassificationSelector({ id, value }: ClassificationSelectorProps) {
  const onValueChange = (e) => console.log("changed , ", e);

  const options = Object.values(CompClassification).map((value) => ({
    label: value,
    value,
  }));

  return (
    <div>
      <Select onValueChange={onValueChange} value={value ?? ""} options={options} />
    </div>
  );
}
