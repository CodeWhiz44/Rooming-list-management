import api from "./axios";

type paramsType = {
    query?: string;
    status?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
};

export async function getRoomingListsGrouped(params: paramsType) {
    const res = await api.get("/rooming-lists/grouped", { params });
    return res.data;
}

export async function getRoomingLists(params: paramsType) {
    const res = await api.get("/rooming-lists", { params });
    return res.data;
}

export async function createSeedRoomingList() {
    const res = await api.post("/seed");
    return res.data;
}
