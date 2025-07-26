import { useMasterTableStore } from "@/zustand/store1";

export const useMasterTableState = () => {
  const globalFilter = useMasterTableStore((state) => state.globalFilter);
  const setGlobalFilter = useMasterTableStore((state) => state.setGlobalFilter);
  const sorting = useMasterTableStore((state) => state.sorting);
  const setSorting = useMasterTableStore((state) => state.setSorting);
  const rowSelection = useMasterTableStore((state) => state.rowSelection);
  const setRowSelection = useMasterTableStore((state) => state.setRowSelection);

  return {
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
  };
};
