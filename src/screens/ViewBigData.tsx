import type { CompanyDto } from "../api/ApiTypes";
import { KeyValue } from "../components/KeyValue";
import { DataTable } from "../components/dataTables/DataTable";
import ClassificationSelector from "../components/ClassificationSelector";
import DeleteCompButton from "../components/DeleteCompButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getCompaniesQueryOptions } from "../api/queryOptions";

function ViewBigData() {
  // const [data, setData] = useState<CompanyDto[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const { data, status, isLoading } = useQuery(getCompaniesQueryOptions());

  const selectedCompany = useQueryClient()
    .getQueryData<CompanyDto[]>(["companiz"])
    ?.find((company) => company.id === selectedCompanyId);

  if (isLoading || !data) {
    return <div>loading .... </div>;
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

          <ClassificationSelector
            disabled={!selectedCompany}
            id={selectedCompany?.id ?? -1}
            value={selectedCompany?.classification}
          />

          <DeleteCompButton companyId={selectedCompanyId} />
          <h1 onClick={() => console.log(data)}>Popover soon</h1>
        </section>
        <section className="">
          <KeyValue keyTitle="kkk" valueTitle="vvv" data={selectedCompany} />
        </section>
      </div>
    </>
  );
}

export default ViewBigData;
