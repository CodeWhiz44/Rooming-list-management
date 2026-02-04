import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { BookingQueryParams, bookingQueryParamsSchema } from "../schemas/rooming-list.schema";

export async function getAllBookings(
    req: Request<{}, {}, {}, BookingQueryParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const { eventId, hotelId, search, page = 1, pageSize = 12 } = req.query;
        const where: any = {};
        if (eventId) where.eventId = eventId;
        if (hotelId) where.hotelId = hotelId;
        if (search) {
            where.OR = [
                { guestName: { contains: search, mode: "insensitive" } },
                { guestPhoneNumber: { contains: search, mode: "insensitive" } },
            ];
        }

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const [data, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                skip,
                take,
                orderBy: { checkInDate: "asc" },
            }),
            prisma.booking.count({ where }),
        ]);
        res.json({
            data,
            total,
            page,
            pageSize,
            pages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        next(error);
    }
}
