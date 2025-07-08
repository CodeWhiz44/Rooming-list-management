import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "supersecret";

export function authenticateJWT(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Missing auth header" });
        return;
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Invalid token" });
            return;
        }
        (req as any).user = user;
        next();
    });
}
