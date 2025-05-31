import type { CompanyDto } from "../api/ApiTypes";
import { apiClient } from "../api/ApiClient";
import { Button } from "../components/Button";
import { ThemeSelect } from "../components/ThemeSelect";
import { KeyValue } from "../components/KeyValue";
import { DataTable } from "../components/dataTables/DataTable";
import ClassificationSelector from "../components/ClassificationSelector";
import DeleteCompButton from "../components/DeleteCompButton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function ViewBigData() {
  // const [data, setData] = useState<CompanyDto[]>([]);
  const [keyValueData, setKeyValueData] = useState<CompanyDto | null>(null);

  const { data, status, isLoading } = useQuery({ queryKey: ["companiz"], queryFn: apiClient.getCompanies });

  if (isLoading || !data) {
    return <div>loading .... </div>;
  }

  return (
    <>
      <div className="flex gap-20  items-start pt-6 bg-bg-background">
        <section className="">
          <DataTable data={data} onRowSelect={setKeyValueData} />
        </section>
        <section className="flex flex-col gap-5">
          <div className="flex flex-col text-text-body">
            <span>Company ID:</span>
            <span className="text-3xl self-center min-h-12">{keyValueData?.id ?? " "}</span>
          </div>

          <ClassificationSelector
            disabled={!keyValueData}
            id={keyValueData?.id ?? -1}
            value={keyValueData?.classification ?? ""}
          />

          <DeleteCompButton companyId={keyValueData?.id} />
          <h1 onClick={() => console.log(data)}>Popover soon</h1>
        </section>
        <section className="">
          <KeyValue keyTitle="kkk" valueTitle="vvv" data={keyValueData} />
        </section>
      </div>
    </>
  );
}

export default ViewBigData;
