import type { RowSelectionState, SortingState, Updater } from "@tanstack/react-table";
import { create } from "zustand";

type Store = {
  rowSelection: RowSelectionState;
  setRowSelection: (r: RowSelectionState) => void;

  globalFilter: string;
  setGlobalFilter: (filter: string) => void;

  sorting: SortingState;
  setSorting: (updater: Updater<SortingState>) => void;
};

export const useMasterTableStore = create<Store>((set, get) => ({
  rowSelection: {},
  setRowSelection: (r) => set({ rowSelection: r }),

  globalFilter: "",
  setGlobalFilter: (filter) => set({ globalFilter: filter }),

  sorting: [],
  setSorting: (updater) => set({ sorting: typeof updater === "function" ? updater(get().sorting) : updater }),
}));
