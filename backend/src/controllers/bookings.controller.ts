import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { BookingQueryParams, CreateBookingInput, UpdateBookingInput } from "../schemas/rooming-list.schema";

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

export async function createBooking(
    req: Request<{}, {}, CreateBookingInput>,
    res: Response,
    next: NextFunction
) {
    try {
        const booking = await prisma.booking.create({
            data: {
                bookingId: req.body.bookingId,
                hotelId: req.body.hotelId,
                eventId: req.body.eventId,
                guestName: req.body.guestName,
                guestPhoneNumber: req.body.guestPhoneNumber,
                checkInDate: new Date(req.body.checkInDate),
                checkOutDate: new Date(req.body.checkOutDate),
            },
        });
        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
}

export async function updateBooking(
    req: Request<{ id: number }, {}, UpdateBookingInput>,
    res: Response,
    next: NextFunction
) {
    try {
        const bookingId = Number(req.params.id);

        const updateData: any = {};
        if (req.body.hotelId !== undefined) updateData.hotelId = req.body.hotelId;
        if (req.body.eventId !== undefined) updateData.eventId = req.body.eventId;
        if (req.body.guestName !== undefined) updateData.guestName = req.body.guestName;
        if (req.body.guestPhoneNumber !== undefined) updateData.guestPhoneNumber = req.body.guestPhoneNumber;
        if (req.body.checkInDate !== undefined) updateData.checkInDate = new Date(req.body.checkInDate);
        if (req.body.checkOutDate !== undefined) updateData.checkOutDate = new Date(req.body.checkOutDate);

        const booking = await prisma.booking.update({
            where: { bookingId },
            data: updateData,
        });
        res.json(booking);
    } catch (error) {
        next(error);
    }
}

export async function deleteBooking(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
) {
    try {
        const bookingId = Number(req.params.id);

        // Delete associated rooming list bookings first
        await prisma.roomingListBooking.deleteMany({
            where: { bookingId },
        });

        // Delete the booking
        await prisma.booking.delete({
            where: { bookingId },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
