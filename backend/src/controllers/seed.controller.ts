import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { loadSeedData } from "../utils/seedUtils";
import { Booking, RoomingList } from "../types";
const prisma = new PrismaClient();

export async function seedDatabase(req: Request, res: Response) {
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
}
