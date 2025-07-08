import request from "supertest";
import app from "../src/index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Seed Database API", () => {
    afterAll(async () => {
        await prisma.roomingListBooking.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.roomingList.deleteMany();
        await prisma.$disconnect();
    });

    it("should seed the database and return false", async () => {
        const res = await request(app).post("/api/seed");
        expect(res.status).toBe(401);
    });

    it("should seed the database and return ok:true", async () => {
        const authRes = await request(app)
            .post("/api/auth/login")
            .send({ username: "testuser" });
        const jwt = authRes.body.token;

        const res = await request(app)
            .post("/api/seed")
            .set("Authorization", `Bearer ${jwt}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("ok", true);

        const bookings = await prisma.booking.findMany();
        const roomingLists = await prisma.roomingList.findMany();
        const links = await prisma.roomingListBooking.findMany();

        expect(bookings.length).toBeGreaterThan(0);
        expect(roomingLists.length).toBeGreaterThan(0);
        expect(links.length).toBeGreaterThan(0);
    });
});
