export interface Booking {
    bookingId: number;
    hotelId: number;
    eventId: number;
    guestName: string;
    guestPhoneNumber: string;
    checkInDate: string;
    checkOutDate: string;
}
export interface RoomingList {
    roomingListId: number;
    eventName: string;
    eventId: number;
    hotelId: number;
    rfpName: string;
    cutOffDate: string;
    status: string;
    agreement_type: string;
}
export interface RoomingListBooking {
    roomingListId: number;
    bookingId: number;
}
