import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getRoomingLists(req: Request, res: Response) {
    const {
        search,
        status,
        sort = "asc",
        page = 1,
        pageSize = 5,
    } = req.query as any;
    const where: any = {};
    if (search) {
        where.OR = [
            { rfpName: { contains: search, mode: "insensitive" } },
            { eventName: { contains: search, mode: "insensitive" } },
            { agreement_type: { contains: search, mode: "insensitive" } },
        ];
    }
    if (status) where.status = status;
    const orderBy = {
        cutOffDate: (sort === "desc" ? "desc" : "asc") as "asc" | "desc",
    };
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);

    const [data, total] = await Promise.all([
        prisma.roomingList.findMany({
            where,
            orderBy,
            skip,
            take,
            include: { roomingListLinks: { include: { booking: true } } },
        }),
        prisma.roomingList.count({ where }),
    ]);
    res.json({
        data,
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
    });
}

export async function getRoomingListBookings(req: Request, res: Response) {
    const roomingListId = Number(req.params.id);
    const links = await prisma.roomingListBooking.findMany({
        where: { roomingListId },
        include: { booking: true },
    });
    res.json(links.map((link: any) => link.booking));
}

export async function getRoomingListsGrouped(req: Request, res: Response) {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const pageSize =
        Number(req.query.pageSize) > 0 ? Number(req.query.pageSize) : 4;

    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const sort = (req.query.sort as string) || "asc";

    const where: any = {};
    if (search) {
        where.OR = [
            { rfpName: { contains: search, mode: "insensitive" } },
            { eventName: { contains: search, mode: "insensitive" } },
            { agreement_type: { contains: search, mode: "insensitive" } },
        ];
    }
    if (status) where.status = status;

    const allEvents = await prisma.roomingList.findMany({
        where,
        select: { eventId: true, eventName: true },
        distinct: ["eventId"],
        orderBy: { eventId: "asc" },
    });

    const totalEvents = allEvents.length;
    const pages = Math.ceil(totalEvents / pageSize);
    const paginatedEvents = allEvents.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const grouped = await Promise.all(
        paginatedEvents.map(async ({ eventId, eventName }) => {
            const lists = await prisma.roomingList.findMany({
                where: { ...where, eventId },
                orderBy: { cutOffDate: sort === "desc" ? "desc" : "asc" },
                include: { roomingListLinks: { include: { booking: true } } },
            });
            return { eventId, eventName, lists };
        })
    );

    res.json({
        data: grouped,
        totalEvents,
        page,
        pageSize,
        pages,
    });
}
