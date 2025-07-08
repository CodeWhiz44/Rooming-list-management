import { Router } from "express";
import { getAllBookings } from "../controllers/bookings.controller";
const router = Router();

router.get("/", getAllBookings);

export default router;
