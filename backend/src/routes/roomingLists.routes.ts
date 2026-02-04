import { Router } from "express";
import {
    getRoomingLists,
    getRoomingListBookings,
    getRoomingListsGrouped,
    createRoomingList,
    updateRoomingList,
    deleteRoomingList,
} from "../controllers/roomingLists.controller";
import { validateQuery, validateBody, validateParams } from "../middleware/validation.middleware";
import { queryParamsSchema, createRoomingListSchema, updateRoomingListSchema, idParamSchema } from "../schemas/rooming-list.schema";
const router = Router();

router.get("/", validateQuery(queryParamsSchema), getRoomingLists);
router.get("/grouped", validateQuery(queryParamsSchema), getRoomingListsGrouped);
router.post("/", validateBody(createRoomingListSchema), createRoomingList);
router.get("/:id/bookings", validateParams(idParamSchema), getRoomingListBookings);
router.put("/:id", validateParams(idParamSchema), validateBody(updateRoomingListSchema), updateRoomingList);
router.delete("/:id", validateParams(idParamSchema), deleteRoomingList);

export default router;
