import { Router } from "express";
import { getAllBookings } from "../controllers/bookings.controller";
import { validateQuery } from "../middleware/validation.middleware";
import { bookingQueryParamsSchema } from "../schemas/rooming-list.schema";
const router = Router();

router.get("/", validateQuery(bookingQueryParamsSchema), getAllBookings);

export default router;
