import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";
export function signJWT(payload: object) {
    return jwt.sign(payload, SECRET, { expiresIn: "8h" });
}
export function verifyJWT(token: string) {
    return jwt.verify(token, SECRET);
}
