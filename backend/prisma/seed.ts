import { PrismaClient } from "@prisma/client";
import { loadSeedData } from "../src/utils/seedUtils";

const prisma = new PrismaClient();

async function main() {
    const { roomingLists, bookings, links } = loadSeedData();

    await prisma.roomingListBooking.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.roomingList.deleteMany();

    await prisma.booking.createMany({ data: bookings });
    await prisma.roomingList.createMany({ data: roomingLists });
    await prisma.roomingListBooking.createMany({ data: links });
}
main().finally(() => prisma.$disconnect());
