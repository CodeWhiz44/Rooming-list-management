import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signJWT } from "../utils/jwt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { username }
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
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function register(req: Request, res: Response): Promise<void> {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required" });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters" });
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            res.status(409).json({ message: "Username already exists" });
            return;
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const user = await prisma.user.create({
            data: {
                username,
                passwordHash
            }
        });

        const token = signJWT({ userId: user.id, username: user.username });
        res.status(201).json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
