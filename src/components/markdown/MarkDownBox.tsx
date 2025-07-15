// import Markdown from "@uiw/react-md-editor/markdown";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useState } from "react";

type MarkDownBoxPropps = {
  note?: string | undefined;
};

export const MarkDownBox = ({ note }: MarkDownBoxPropps) => {
  const [theme, setTheme] = useState<"light" | "dark" | undefined>("light");

  note = `# header *bb* 
  
  lol
  - sup
  - coews
  <span style='color: red'> flushed face </span>
  `;

  return (
    <>
      <div className="mdEdit123">
        <MarkdownPreview
          source={note}
          style={{ whiteSpace: "pre-wrap" }}
          wrapperElement={{ "data-color-mode": theme }}
        />
        <input type="checkbox" value="light" onChange={(e) => setTheme(e.target.value as "light")}></input>
        <input type="checkbox" value="dark" onChange={(e) => setTheme(e.target.value as "dark")}></input>
      </div>
    </>
  );
};
