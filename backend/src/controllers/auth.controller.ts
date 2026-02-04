import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { signJWT } from "../utils/jwt";
import prisma from "../lib/prisma";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 10;

export async function login(
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }

        const token = signJWT({ userId: user.id, username: user.username });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        next(error);
    }
}

export async function register(
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { username, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            res.status(409).json({ message: "Username already exists" });
            return;
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                username,
                passwordHash,
            },
        });

        const token = signJWT({ userId: user.id, username: user.username });
        res.status(201).json({
            token,
            user: { id: user.id, username: user.username },
        });
    } catch (error) {
        next(error);
    }
}
