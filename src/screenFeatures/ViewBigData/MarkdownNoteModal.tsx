import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal";
import { lazy } from "react";

// import React from "react";
// import { MarkDownEditor } from "../../components/markdown/MarkDownEditor";
import { usePatchCompanyInfinite } from "../../hooks/company/usePatchCompany";
import { isDefined } from "../../helpers/isDefined";

type MarkdownNoteModalProps = {
  companyNote: string | undefined;
  // setDraft: React.Dispatch<React.SetStateAction<string | undefined>>;
  compId: number | undefined;
};

const MarkDownEditor = lazy(() =>
  import("../../components/markdown/MarkDownEditor").then((mod) => ({
    default: mod.MarkDownEditor,
  }))
);

export const MarkdownNoteModal = ({ companyNote, compId }: MarkdownNoteModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<string | undefined>(() => companyNote); // for editing

  useEffect(() => {
    setDraft(companyNote);
  }, [companyNote]);

  const { mutate } = usePatchCompanyInfinite();

  const patchNote = () => {
    if (draft === companyNote || !isDefined(compId)) return;

    mutate({
      compId,
      body: {
        markdownNote: draft,
      },
    });
  };

  const handleModalClose = (nextOpen: boolean) => {
    if (!nextOpen) patchNote();
    setIsModalOpen(nextOpen);
  };

  const handleCancel = () => {
    setDraft(companyNote);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    patchNote();
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Edit MD note</Button>

      <Modal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        title="Edit Markdown Note"
        position="center"
        ariaDescription="Modal for editing Company note"
      >
        <MarkDownEditor value={draft} setValue={setDraft} />

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </>
  );
};
