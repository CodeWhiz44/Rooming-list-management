import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllBookings(req: Request, res: Response) {
    const {
        eventId,
        hotelId,
        search,
        page = 1,
        pageSize = 12,
    } = req.query as any;
    const where: any = {};
    if (eventId) where.eventId = Number(eventId);
    if (hotelId) where.hotelId = Number(hotelId);
    if (search) {
        where.OR = [
            { guestName: { contains: search, mode: "insensitive" } },
            { guestPhoneNumber: { contains: search, mode: "insensitive" } },
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);

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
}
