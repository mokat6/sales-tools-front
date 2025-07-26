import { KeyValue } from "../components/KeyValue";
import ClassificationSelector from "../screenFeatures/ViewBigData/ClassificationSelector";
import DeleteCompButton from "../screenFeatures/ViewBigData/DeleteCompButton";
import { useCallback, useRef, useState } from "react";
import formatCompany from "../format/formatCompany";
import { MasterTable } from "../screenFeatures/ViewBigData/masterTable/MasterTable";
import {
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { CompanyDto } from "../api/SwaggerSdk";
import { columns } from "@/screenFeatures/ViewBigData/masterTable/columns";

import type { CompaniesInfiniteQueryResult } from "../hooks/company/useCompaniesTableDataCursor_infinite";
import { useCompany_InfinityCursor } from "../hooks/company/useCompany";
import { ContactsContainer } from "@/screenFeatures/ViewBigData/contacts/ContactsContainer";
import { TableToolbarButton } from "../components/TableToolbarButton";
import { MarkdownNoteModal } from "../screenFeatures/ViewBigData/MarkdownNoteModal";
import { MarkDownPreview } from "../components/markdown/MarkDownPreview";
import {
  MasterTableBusiness,
  type MasterTableHandle,
} from "@/screenFeatures/ViewBigData/masterTable/MasterTableBusiness";

type ViewBigDataContentProps = Omit<CompaniesInfiniteQueryResult, "isLoading"> & {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

function ViewBigDataContent({
  tableData,
  totalDbRowCount,
  isFetching,
  fetchNextPage,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
  hasNextPage,
  downloadAll,
}: ViewBigDataContentProps) {
  const MasterTableHandleRef = useRef<MasterTableHandle>(null);
  const selectedIndex = MasterTableHandleRef.current?.selectedIndex;
  const reselectFn = MasterTableHandleRef.current?.reselectRowAfterDelete;
  console.log("Screen selectedIndex ___ ", selectedIndex);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
    const firstRowId = tableData[0]?.id;
    return firstRowId ? { [firstRowId]: true } : {};
  });

  const selectedCompanyIdString: string | undefined = Object.keys(rowSelection)[0];
  const selectedCompanyId = selectedCompanyIdString ? Number(selectedCompanyIdString) : undefined;
  const { data: selectedCompany } = useCompany_InfinityCursor(selectedCompanyId);

  console.log("Rendering +++++++ .... ViewBigDataContent, selectedCompanyId> ", selectedCompanyId);

  return (
    <>
      <div className="flex gap-20  items-start  p-6 bg-bg-background">
        <section className="mt-10">
          <MasterTableBusiness
            downloadAll={downloadAll}
            fetchNextPage={fetchNextPage}
            globalFilter={globalFilter}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            setGlobalFilter={setGlobalFilter}
            setSorting={setSorting}
            sorting={sorting}
            tableData={tableData}
            totalDbRowCount={totalDbRowCount}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
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
            reselectRowAfterDelete={() => {
              if (reselectFn) reselectFn(selectedIndex);
            }}
            companyId={selectedCompanyId}
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

export default ViewBigDataContent;
