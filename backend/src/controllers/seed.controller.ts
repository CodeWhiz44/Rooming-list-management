import { Request, Response, NextFunction } from "express";
import { loadSeedData } from "../utils/seedUtils";
import { Booking, RoomingList } from "../types";
import prisma from "../lib/prisma";

export async function seedDatabase(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomingLists, bookings, links } = loadSeedData();

        await prisma.roomingListBooking.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.roomingList.deleteMany();

        await prisma.booking.createMany({
            data: bookings.map((b: Booking) => ({
                ...b,
                checkInDate: new Date(b.checkInDate).toISOString(),
                checkOutDate: new Date(b.checkOutDate).toISOString(),
            })),
        });

        await prisma.roomingList.createMany({
            data: roomingLists.map((rl: RoomingList) => ({
                ...rl,
                cutOffDate: new Date(rl.cutOffDate).toISOString(),
            })),
        });

        await prisma.roomingListBooking.createMany({ data: links });

        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
}
