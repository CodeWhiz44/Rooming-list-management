import { create } from "zustand";
import type { IRoomingListsGrouped } from "../types";
import { getRoomingListsGrouped } from "../api/roomingList";

export type Store = {
    query: string;
    status?: string;
    sort: string;
    page: number;
    pageSize: number;
    total: number;
    roomingListsGrouped: IRoomingListsGrouped[];
    loading: boolean;
    setQuery: (q: string) => void;
    setStatus: (s: string) => void;
    setSort: (s: string) => void;
    fetchLists: (append?: boolean, customPage?: number) => Promise<void>;
    fetchMore: () => Promise<void>;
};

export const useRoomingListStore = create<Store>((set, get) => ({
    query: "",
    status: undefined,
    sort: "asc",
    page: 1,
    pageSize: 2,
    total: 0,
    roomingListsGrouped: [],
    loading: false,

    setQuery: (q) => set({ query: q, page: 1, roomingListsGrouped: [] }),
    setStatus: (s) => set({ status: s, page: 1, roomingListsGrouped: [] }),
    setSort: (s) => set({ sort: s, page: 1, roomingListsGrouped: [] }),

    fetchLists: async (append = false, customPage?: number) => {
        set({ loading: true });

        const { query, status, sort, page, pageSize } = get();
        const currentPage = customPage ?? page;

        const params = {
            ...(query ? { search: query } : {}),
            ...(status ? { status } : {}),
            sort,
            page: currentPage,
            pageSize,
        };

        try {
            const res = await getRoomingListsGrouped(params);
            set((state) => ({
                roomingListsGrouped: append
                    ? [...state.roomingListsGrouped, ...res.data]
                    : res.data,
                total: res.totalEvents,
                loading: false,
                page: currentPage,
                pageSize: res.pageSize ?? pageSize,
            }));
        } catch {
            set({ loading: false });
        }
    },

    fetchMore: async () => {
        const { page, pageSize, total, loading } = get();
        if (loading) return;
        if (page * pageSize >= total) return;
        const nextPage = page + 1;
        await get().fetchLists(true, nextPage);
    },
}));
