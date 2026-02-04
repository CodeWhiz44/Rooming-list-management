import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { QueryParams } from "../schemas/rooming-list.schema";

export async function getRoomingLists(
    req: Request<{}, {}, {}, QueryParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const { search, status, sort = "asc", page = 1, pageSize = 5 } = req.query;
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
            cutOffDate: sort as "asc" | "desc",
        };
        const skip = (page - 1) * pageSize;
        const take = pageSize;

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
    } catch (error) {
        next(error);
    }
}

export async function getRoomingListBookings(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const roomingListId = Number(req.params.id);
        const links = await prisma.roomingListBooking.findMany({
            where: { roomingListId },
            include: { booking: true },
        });
        res.json(links.map((link: any) => link.booking));
    } catch (error) {
        next(error);
    }
}

export async function getRoomingListsGrouped(req: Request<{}, {}, {}, QueryParams>, res: Response, next: NextFunction) {
    try {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 4;

        const search = req.query.search as string | undefined;
        const status = req.query.status as string | undefined;
        const sort = req.query.sort || "asc";

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
    } catch (error) {
        next(error);
    }
}
