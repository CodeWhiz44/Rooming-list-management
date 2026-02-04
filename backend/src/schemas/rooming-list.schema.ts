import { z } from "zod";

export const queryParamsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(5),
    search: z.string().optional(),
    status: z.string().optional(),
    sort: z.enum(["asc", "desc"]).default("asc"),
});

export const bookingQueryParamsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(12),
    eventId: z.coerce.number().int().optional(),
    hotelId: z.coerce.number().int().optional(),
    search: z.string().optional(),
});

// Create RoomingList validation schema
export const createRoomingListSchema = z.object({
    roomingListId: z.number().int().positive(),
    eventId: z.number().int().positive(),
    hotelId: z.number().int().positive(),
    eventName: z.string().min(1, "Event name is required"),
    rfpName: z.string().min(1, "RFP name is required"),
    cutOffDate: z.string().datetime(),
    status: z.string().min(1, "Status is required"),
    agreement_type: z.string().min(1, "Agreement type is required"),
});

// Update RoomingList validation schema (all fields optional)
export const updateRoomingListSchema = z.object({
    eventId: z.number().int().positive().optional(),
    hotelId: z.number().int().positive().optional(),
    eventName: z.string().min(1).optional(),
    rfpName: z.string().min(1).optional(),
    cutOffDate: z.string().datetime().optional(),
    status: z.string().min(1).optional(),
    agreement_type: z.string().min(1).optional(),
});

// Create Booking validation schema
export const createBookingSchema = z.object({
    bookingId: z.number().int().positive(),
    hotelId: z.number().int().positive(),
    eventId: z.number().int().positive(),
    guestName: z.string().min(1, "Guest name is required"),
    guestPhoneNumber: z.string().min(1, "Phone number is required"),
    checkInDate: z.string().datetime(),
    checkOutDate: z.string().datetime(),
});

// Update Booking validation schema (all fields optional)
export const updateBookingSchema = z.object({
    hotelId: z.number().int().positive().optional(),
    eventId: z.number().int().positive().optional(),
    guestName: z.string().min(1).optional(),
    guestPhoneNumber: z.string().min(1).optional(),
    checkInDate: z.string().datetime().optional(),
    checkOutDate: z.string().datetime().optional(),
});

// Param validation for IDs
export const idParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type QueryParams = z.infer<typeof queryParamsSchema>;
export type BookingQueryParams = z.infer<typeof bookingQueryParamsSchema>;
export type CreateRoomingListInput = z.infer<typeof createRoomingListSchema>;
export type UpdateRoomingListInput = z.infer<typeof updateRoomingListSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
