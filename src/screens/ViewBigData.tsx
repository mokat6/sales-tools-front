import { KeyValue } from "../components/KeyValue";
import ClassificationSelector from "../screenFeatures/ViewBigData/ClassificationSelector";
import DeleteCompButton from "../screenFeatures/ViewBigData/DeleteCompButton";
import { useRef } from "react";
import formatCompany from "../format/formatCompany";

import { useCompaniesTableDataCursor_infinite } from "../hooks/company/useCompaniesTableDataCursor_infinite";
import { useCompany_InfinityCursor } from "../hooks/company/useCompany";
import { ContactsContainer } from "@/screenFeatures/ViewBigData/contacts/ContactsContainer";
import { MarkdownNoteModal } from "../screenFeatures/ViewBigData/MarkdownNoteModal";
import { MarkDownPreview } from "../components/markdown/MarkDownPreview";
import {
  MasterTableBusiness,
  type MasterTableHandle,
} from "@/screenFeatures/ViewBigData/masterTable/MasterTableBusiness";
import { useSelecedRowId } from "@/hooks/zustand/useSelectedRowId";
import { Spinner } from "@/components/Spinner";

function ViewBigData() {
  const MasterTableHandleRef = useRef<MasterTableHandle>(null);
  const selectedCompanyId = useSelecedRowId();
  const { data: selectedCompany } = useCompany_InfinityCursor(selectedCompanyId);

  const { isLoading, tableData, totalDbRowCount, isFetching, fetchNextPage, hasNextPage, downloadAll } =
    useCompaniesTableDataCursor_infinite();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );

  return (
    <>
      <div className="flex gap-20  items-start  p-6 bg-bg-background">
        <section className="mt-10">
          <MasterTableBusiness
            downloadAll={downloadAll}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            tableData={tableData}
            totalDbRowCount={totalDbRowCount}
            ref={MasterTableHandleRef}
          />
        </section>
        <section className="flex flex-col gap-5">
          <div className="flex flex-col text-text-body">
            <span>Company ID:</span>
            <span className="text-3xl self-center min-h-12">{selectedCompanyId}</span>
          </div>

          <ClassificationSelector id={selectedCompanyId} value={selectedCompany?.classification} />

          <DeleteCompButton
            reselectRowAfterDelete={MasterTableHandleRef.current?.reselectRowAfterDelete}
            companyId={selectedCompanyId}
            getRowIndex={MasterTableHandleRef.current?.getSelectedIndex}
          />

          <MarkdownNoteModal companyNote={selectedCompany?.markdownNote} compId={selectedCompanyId} />
        </section>
        <section className="flex flex-col gap-10">
          <div className="min-h-135 flex gap-10 items-start">
            <KeyValue keyTitle="Key" valueTitle="Value" data={formatCompany(selectedCompany)} />
            <div className="w-120">
              <MarkDownPreview note={selectedCompany?.markdownNote} />
            </div>
          </div>
          <ContactsContainer compId={selectedCompanyId} />
        </section>
      </div>
    </>
  );
}

export default ViewBigData;
