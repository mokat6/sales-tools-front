import { useMasterTableStore } from "@/zustand/store1";
import type { RowSelectionState } from "@tanstack/react-table";

export const useSelecedRowId = () => {
  const selectedRowId = useMasterTableStore((state) => getSelectedRowId(state.rowSelection));
  return selectedRowId ? Number(selectedRowId) : undefined;
};

export function getSelectedRowId(rowSelection: RowSelectionState): string | undefined {
  return Object.keys(rowSelection)[0];
}
