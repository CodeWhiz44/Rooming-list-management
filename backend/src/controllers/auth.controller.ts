import { Request, Response } from "express";
import { signJWT } from "../utils/jwt";

export function login(req: Request, res: Response): void {
    const { username } = req.body;
    if (!username) {
        res.status(400).json({ message: "username required" });
        return;
    }
    const token = signJWT({ username });
    res.json({ token });
}
