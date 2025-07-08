import { Router } from "express";
import {
    getRoomingLists,
    getRoomingListBookings,
    getRoomingListsGrouped,
} from "../controllers/roomingLists.controller";
const router = Router();

router.get("/", getRoomingLists);
router.get("/grouped", getRoomingListsGrouped);
router.get("/:id/bookings", getRoomingListBookings);

export default router;
