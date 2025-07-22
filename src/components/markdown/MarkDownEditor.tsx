// default import is with highlights. No need, buggy, textbox doesn't stretch to height 100%
// import MDEditor, { commands } from "@uiw/react-md-editor";
import MDEditor, { commands } from "@uiw/react-md-editor/nohighlight";
import rehypeSanitize from "rehype-sanitize";

// import the style overrides .css file in global index.css
// import "./markdownOverrides.styles.css";
import "@uiw/react-md-editor/markdown-editor.css";

import React from "react";
import { Tooltip } from "../Tooltip";

type MarkDownEditorProps = {
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  placeholder?: string;
};

export const MarkDownEditor = ({ placeholder, value, setValue }: MarkDownEditorProps) => {
  placeholder = placeholder ?? "Type your markdown here...";

  return (
    <div className="mdEdit123 rounded-lg shadow-md [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
      <MDEditor
        enableScroll={false}
        height={400}
        visibleDragbar={true}
        value={value}
        onChange={setValue}
        autoFocusEnd={true}
        preview={"live"}
        // data-color-mode={} // no theme, theme controlled by my page globally, and overridden by css
        textareaProps={{
          placeholder,
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
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        components={{
          toolbar: (command, disabled, executeCommand) => {
            if (!command.icon) return;

            const fixedIcon = React.cloneElement(command.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
              className: "w-full h-full",
              width: undefined,
              height: undefined,
            });

            return (
              <Tooltip message={command.buttonProps?.title ?? command.name} contentClass="z-50">
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
              </Tooltip>
            );
          },
        }}
      />
    </div>
  );
};
