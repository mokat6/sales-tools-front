import MarkdownPreview from "@uiw/react-markdown-preview";

type MarkDownPreviewPropps = {
  note?: string | undefined;
};

export const MarkDownPreview = ({ note }: MarkDownPreviewPropps) => {
  note = note || "> Nothing has been written yet.";
  return (
    <>
      <div className="mdEdit123 rounded-lg shadow-md [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
        <MarkdownPreview source={note} style={{ whiteSpace: "normal", colorScheme: "inherit" }} className="p-8" />
      </div>
    </>
  );
};
