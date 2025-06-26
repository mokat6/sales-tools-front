import { KeyValue } from "../components/KeyValue";
import ClassificationSelector from "../components/ClassificationSelector";
import DeleteCompButton from "../components/DeleteCompButton";
import { useState } from "react";
import { useCompany_InfinityCursor } from "../hooks/company/useCompany";
import formatCompany from "../format/formatCompany";
import { DataTable } from "../dataTables/infinite/DataTable";

function ViewBigData() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const { data: selectedCompany } = useCompany_InfinityCursor(selectedCompanyId);

  return (
    <>
      <div className="flex gap-20  items-start pt-6 bg-bg-background">
        <section className="">
          <DataTable onRowSelect={setSelectedCompanyId} />
        </section>
        <section className="flex flex-col gap-5">
          <div className="flex flex-col text-text-body">
            <span>Company ID:</span>
            <span className="text-3xl self-center min-h-12">{selectedCompanyId}</span>
          </div>

          <ClassificationSelector id={selectedCompanyId} value={selectedCompany?.classification} />

          <DeleteCompButton companyId={selectedCompanyId} />
          {/* <h1 onClick={() => console.log(companies)}>Popover soon</h1> */}
        </section>
        <section className="">
          <KeyValue keyTitle="Key" valueTitle="Value" data={formatCompany(selectedCompany)} />
        </section>
      </div>
    </>
  );
}

export default ViewBigData;
