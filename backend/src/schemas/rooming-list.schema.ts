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

export type QueryParams = z.infer<typeof queryParamsSchema>;
export type BookingQueryParams = z.infer<typeof bookingQueryParamsSchema>;
