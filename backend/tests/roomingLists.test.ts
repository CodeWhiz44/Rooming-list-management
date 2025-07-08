import request from "supertest";
import app from "../src/index";

describe("Rooming List API", () => {
    let jwt = "";

    beforeAll(async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username: "testuser" });
        jwt = res.body.token;
    });

    describe("GET /api/rooming-lists", () => {
        it("should return paginated rooming lists", async () => {
            const res = await request(app)
                .get("/api/rooming-lists")
                .set("Authorization", `Bearer ${jwt}`)
                .query({ page: 1, pageSize: 2 });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body).toHaveProperty("total");
        });
    });

    describe("GET /api/rooming-lists/:id/bookings", () => {
        it("should return bookings for a given rooming list", async () => {
            // Use a known valid roomingListId from your test data
            const roomingListId = 1;
            const res = await request(app)
                .get(`/api/rooming-lists/${roomingListId}/bookings`)
                .set("Authorization", `Bearer ${jwt}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            if (res.body.length) {
                expect(res.body[0]).toHaveProperty("bookingId");
            }
        });
    });

    describe("GET /api/rooming-lists/grouped", () => {
        it("should return grouped rooming lists by event", async () => {
            const res = await request(app)
                .get("/api/rooming-lists/grouped")
                .set("Authorization", `Bearer ${jwt}`)
                .query({ page: 1, pageSize: 2 });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);

            if (res.body.data.length) {
                const group = res.body.data[0];
                expect(group).toHaveProperty("eventId");
                expect(group).toHaveProperty("eventName");
                expect(Array.isArray(group.lists)).toBe(true);
            }
        });
    });

    // Add more edge case tests as needed
});
