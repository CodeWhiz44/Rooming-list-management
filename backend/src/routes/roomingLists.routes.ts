import { Router } from "express";
import {
    getRoomingLists,
    getRoomingListBookings,
    getRoomingListsGrouped,
} from "../controllers/roomingLists.controller";
import { validateQuery } from "../middleware/validation.middleware";
import { queryParamsSchema } from "../schemas/rooming-list.schema";
const router = Router();

router.get("/", validateQuery(queryParamsSchema), getRoomingLists);
router.get("/grouped", validateQuery(queryParamsSchema), getRoomingListsGrouped);
router.get("/:id/bookings", getRoomingListBookings);

export default router;
