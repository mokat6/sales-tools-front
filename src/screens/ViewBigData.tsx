import { KeyValue } from "../components/KeyValue";
import ClassificationSelector from "../components/ClassificationSelector";
import DeleteCompButton from "../components/DeleteCompButton";
import { useState } from "react";
import { Spinner } from "../components/Spinner";
import useCompany from "../hooks/company/useCompany";
import formatCompany from "../format/formatCompany";
import { DataTableOffset } from "../components/dataTables/DataTableOffset";
import { useCompaniesTableData } from "../hooks/company/useCompaniesTableData";

function ViewBigData() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  // const { isLoading, pagination, companies } = useCompanies();
  const { companies, pagination, isLoading } = useCompaniesTableData();
  const selectedCompany = useCompany(selectedCompanyId);

  if (isLoading || !companies || !pagination) {
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
          <DataTableOffset data={companies} pagination={pagination} onRowSelect={setSelectedCompanyId} />
        </section>
        <section className="flex flex-col gap-5">
          <div className="flex flex-col text-text-body">
            <span>Company ID:</span>
            <span className="text-3xl self-center min-h-12">{selectedCompanyId}</span>
          </div>

          <ClassificationSelector id={selectedCompanyId} value={selectedCompany?.classification} />

          <DeleteCompButton companyId={selectedCompanyId} />
          <h1 onClick={() => console.log(companies)}>Popover soon</h1>
        </section>
        <section className="">
          <KeyValue keyTitle="Key" valueTitle="Value" data={formatCompany(selectedCompany)} />
        </section>
      </div>
    </>
  );
}

export default ViewBigData;
