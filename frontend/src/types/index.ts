export type StatusType = "received" | "completed" | "archived";
export type SortType = "asc" | "desc";

export interface IBooking {
    bookingId: number;
    hotelId: number;
    eventId: number;
    guestName: string;
    guestPhoneNumber: string;
    checkInDate: string;
    checkOutDate: string;
}
export interface IRoomingList {
    roomingListId: number;
    eventId: number;
    eventName: string;
    hotelId: number;
    rfpName: string;
    cutOffDate: string;
    status: string;
    agreement_type: string;
    roomingListLinks: { booking: IBooking }[];
}

export interface IRoomingListsGrouped {
    eventId: number;
    eventName: string;
    lists: IRoomingList[];
}
