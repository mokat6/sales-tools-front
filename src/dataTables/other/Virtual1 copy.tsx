import React from "react";
import { useCompaniesTableDataCursor_infinite } from "../../hooks/company/useCompaniesTableDataCursor_infinite";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function Virtual1() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } = useCompaniesTableDataCursor_infinite(13);
  const flatData = React.useMemo(() => data?.pages.flatMap((page) => page.companies ?? []) ?? [], [data]);

  // The scrollable element for your list
  const parentRef = React.useRef(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: 500,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 27,
    getItemKey: (index) => flatData[index]?.id ?? index,
  });

  const totalDbRowCount = data?.pages?.[0].pagination?.totalCount ?? 0;
  const totalFetched = flatData.length;
  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (scrollHeight - scrollTop - clientHeight < 500 && !isFetching && totalFetched < totalDbRowCount) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDbRowCount]
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached(parentRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <>
      <button onClick={() => fetchNextPage()}>gam ngo</button>
      <div
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        ref={parentRef}
        className="w-90 h-100 overflow-auto"
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }} className="w-full relative">
          <div
            style={{ transform: `translateY(${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px)` }}
            className="absolute"
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const rowData = flatData[virtualItem.index];

              return (
                <div key={virtualItem.key} ref={rowVirtualizer.measureElement}>
                  Row {virtualItem.index}: {rowData?.companyName}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
