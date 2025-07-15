import "@uiw/react-md-editor/markdown-editor.css";
// import "@uiw/react-markdown-preview/markdown.css";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Button } from "../components/Button";
import { useState } from "react";
import { Modal } from "../components/Modal";
import MDEditor, { commands } from "@uiw/react-md-editor/nohighlight";
// import "../components/markdown/markdownOverrides.styles.css";
// import MDEditor, { commands, type ICommand } from "@uiw/react-md-editor";

import React from "react";

type MarkdownNoteModalProps = {
  draft: string | undefined;
  setDraft: React.Dispatch<React.SetStateAction<string | undefined>>;
};

// export const MarkdownNoteModal = ({ draft, setDraft }: MarkdownNoteModalProps) => {
export const MarkdownNoteModal = () => {
  const [isOpen, setIsOpen] = useState(false); // modal open/close
  const [draft, setDraft] = useState("# lolol"); // for editing
  const [theme, setTheme] = useState<"light" | "dark" | undefined>("light");
  const [value, setValue] = React.useState<string | undefined>("**Hello world!!!**");

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Edit MD note</Button>

      <Modal open={isOpen} onOpenChange={setIsOpen} title="Edit Markdown Note" position="center">
        <div className="mdEdit123 rounded-lg shadow-md [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
          <MDEditor
            enableScroll={false}
            height={400}
            visibleDragbar={true}
            value={value}
            onChange={setValue}
            autoFocusEnd={true}
            preview={"live"}
            // data-color-mode={theme} // no theme, theme controlled by my page globally
            textareaProps={{
              placeholder: "Type your markdown here...",
            }}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.divider,
              commands.link,
              commands.quote,
              commands.image,
              commands.table,
              commands.divider,
              commands.checkedListCommand,
            ]}
            extraCommands={[]}
            components={{
              toolbar: (command, disabled, executeCommand) => {
                if (!command.icon) return;

                const fixedIcon = React.cloneElement(
                  command.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                  {
                    className: "w-full h-full",
                    width: undefined,
                    height: undefined,
                  }
                );

                return (
                  <Tooltip.Provider delayDuration={100}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          aria-label={command.buttonProps?.["aria-label"]}
                          disabled={disabled}
                          className="!p-2 !h-8 !w-8 !m-1"
                          onClick={(evn) => {
                            evn.stopPropagation();
                            executeCommand(command, command.groupName);
                          }}
                        >
                          {fixedIcon}
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        className="bg-text-body  text-bg-background text-sm px-2 py-1 rounded shadow-md"
                        side="top"
                        sideOffset={5}
                      >
                        {command.buttonProps?.title ?? command.name}
                        <Tooltip.Arrow className="fill-text-body" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                );
              },
            }}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              // setNote(draft);
              setIsOpen(false);
            }}
          >
            Save
          </Button>
          <input
            type="checkbox"
            value="light"
            onChange={(e) => {
              console.log(e.target.value);
              setTheme(e.target.value as "light");
            }}
          ></input>
          <input
            type="checkbox"
            value="dark"
            onChange={(e) => {
              console.log(e.target.value);

              setTheme(e.target.value as "dark");
            }}
          ></input>
        </div>
      </Modal>
    </>
  );
};
