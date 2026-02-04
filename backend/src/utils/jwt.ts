import jwt from "jsonwebtoken";

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is required but not set");
    }
    return secret;
}

export function signJWT(payload: object) {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "8h" });
}

export function verifyJWT(token: string) {
    return jwt.verify(token, getJwtSecret());
}
