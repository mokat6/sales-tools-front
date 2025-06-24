import * as React from "react";
import { faker } from "@faker-js/faker";

import { useVirtualizer } from "@tanstack/react-virtual";

const sentences = new Array(300).fill(true).map(() => faker.lorem.sentence(faker.number.int({ min: 10, max: 70 })));

export default function Virtual() {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const count = sentences.length;
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 10,
  });

  const items = virtualizer.getVirtualItems();

  window.__virt = virtualizer;

  return (
    <div
      ref={parentRef}
      className="List"
      style={{
        height: 400,
        width: 400,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
            >
              <div style={{ padding: "10px 0" }}>
                <div>
                  Row {virtualRow.index}, {virtualRow.end}
                </div>
                <div>{sentences[virtualRow.index]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
