import { Router } from "express";
import { getAllBookings, createBooking, updateBooking, deleteBooking } from "../controllers/bookings.controller";
import { validateQuery, validateBody, validateParams } from "../middleware/validation.middleware";
import { bookingQueryParamsSchema, createBookingSchema, updateBookingSchema, idParamSchema } from "../schemas/rooming-list.schema";
const router = Router();

router.get("/", validateQuery(bookingQueryParamsSchema), getAllBookings);
router.post("/", validateBody(createBookingSchema), createBooking);
router.put("/:id", validateParams(idParamSchema), validateBody(updateBookingSchema), updateBooking);
router.delete("/:id", validateParams(idParamSchema), deleteBooking);

export default router;
