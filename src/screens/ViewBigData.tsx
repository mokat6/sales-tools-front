import { KeyValue } from "../components/KeyValue";
import { DataTable } from "../components/dataTables/DataTable";
import ClassificationSelector from "../components/ClassificationSelector";
import DeleteCompButton from "../components/DeleteCompButton";
import { useState } from "react";
import { Spinner } from "../components/Spinner";
import useCompanies from "../hooks/company/useCompanies";
import useCompany from "../hooks/company/useCompany";
import { formatters } from "../components/helpers/formatters";

function ViewBigData() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const { data, isLoading } = useCompanies();
  const selectedCompany = useCompany(selectedCompanyId);

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-20  items-start pt-6 bg-bg-background">
        <section className="">
          <DataTable data={data} onRowSelect={setSelectedCompanyId} />
        </section>
        <section className="flex flex-col gap-5">
          <div className="flex flex-col text-text-body">
            <span>Company ID:</span>
            <span className="text-3xl self-center min-h-12">{selectedCompanyId}</span>
          </div>

          <ClassificationSelector id={selectedCompanyId} value={selectedCompany?.classification} />

          <DeleteCompButton companyId={selectedCompanyId} />
          <h1 onClick={() => console.log(data)}>Popover soon</h1>
        </section>
        <section className="">
          <KeyValue
            keyTitle="Key"
            valueTitle="Value"
            data={selectedCompany}
            formatters={{
              website: formatters.url,
              googleMapsUrl: formatters.url,
              classification: formatters.companyClassification,
            }}
          />
        </section>
      </div>
    </>
  );
}

export default ViewBigData;
