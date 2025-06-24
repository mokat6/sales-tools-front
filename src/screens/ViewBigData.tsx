import { KeyValue } from "../components/KeyValue";
import ClassificationSelector from "../components/ClassificationSelector";
import DeleteCompButton from "../components/DeleteCompButton";
import { useState } from "react";
import useCompany, { useCompany_InfinityCursor } from "../hooks/company/useCompany";
import formatCompany from "../format/formatCompany";
import { DataTable } from "../dataTables/infinite/DataTable";
import { useCompaniesTableDataCursor_infinite } from "../hooks/company/useCompaniesTableDataCursor_infinite";
import Virtual from "../dataTables/other/Virtual";
import Virtual1 from "../dataTables/other/Virtual1";
import useCompanies from "../hooks/company/useCompanies";
import React from "react";
import { Spinner } from "../components/Spinner";

function ViewBigData() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number>();
  const selectedCompany = useCompany_InfinityCursor(selectedCompanyId);
  const dataTableStuff = useCompaniesTableDataCursor_infinite(37);
  const { isLoading, companies } = dataTableStuff;

  if (isLoading || !companies) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  console.log("ViewBigData is running now!");
  return (
    <>
      <div className="flex gap-20  items-start pt-6 bg-bg-background">
        <section className="">
          {/* <DataTableCursor data={companies} pagination={pagination} onRowSelect={setSelectedCompanyId} /> */}
          <DataTable onRowSelect={setSelectedCompanyId} {...dataTableStuff} />
          {/* <Virtual1 /> */}
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
