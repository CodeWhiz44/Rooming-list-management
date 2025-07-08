import request from "supertest";
import app from "../src/index";

describe("Auth API", () => {
    it("should return token for valid username", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username: "testuser" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toBe("string");
    });

    it("should fail if username missing", async () => {
        const res = await request(app).post("/api/auth/login").send({});

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toMatch(/username required/i);
    });
});
