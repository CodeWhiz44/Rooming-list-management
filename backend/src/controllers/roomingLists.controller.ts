import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { QueryParams, CreateRoomingListInput, UpdateRoomingListInput, IdParam } from "../schemas/rooming-list.schema";

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

export async function createRoomingList(
    req: Request<{}, {}, CreateRoomingListInput>,
    res: Response,
    next: NextFunction
) {
    try {
        const roomingList = await prisma.roomingList.create({
            data: {
                roomingListId: req.body.roomingListId,
                eventId: req.body.eventId,
                hotelId: req.body.hotelId,
                eventName: req.body.eventName,
                rfpName: req.body.rfpName,
                cutOffDate: new Date(req.body.cutOffDate),
                status: req.body.status,
                agreement_type: req.body.agreement_type,
            },
            include: { roomingListLinks: { include: { booking: true } } },
        });
        res.status(201).json(roomingList);
    } catch (error) {
        next(error);
    }
}

export async function updateRoomingList(
    req: Request<{ id: number }, {}, UpdateRoomingListInput>,
    res: Response,
    next: NextFunction
) {
    try {
        const roomingListId = Number(req.params.id);
        
        const updateData: any = {};
        if (req.body.eventId !== undefined) updateData.eventId = req.body.eventId;
        if (req.body.hotelId !== undefined) updateData.hotelId = req.body.hotelId;
        if (req.body.eventName !== undefined) updateData.eventName = req.body.eventName;
        if (req.body.rfpName !== undefined) updateData.rfpName = req.body.rfpName;
        if (req.body.cutOffDate !== undefined) updateData.cutOffDate = new Date(req.body.cutOffDate);
        if (req.body.status !== undefined) updateData.status = req.body.status;
        if (req.body.agreement_type !== undefined) updateData.agreement_type = req.body.agreement_type;

        const roomingList = await prisma.roomingList.update({
            where: { roomingListId },
            data: updateData,
            include: { roomingListLinks: { include: { booking: true } } },
        });
        res.json(roomingList);
    } catch (error) {
        next(error);
    }
}

export async function deleteRoomingList(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
) {
    try {
        const roomingListId = Number(req.params.id);
        
        // Delete associated rooming list bookings first
        await prisma.roomingListBooking.deleteMany({
            where: { roomingListId },
        });

        // Delete the rooming list
        await prisma.roomingList.delete({
            where: { roomingListId },
        });
        
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
