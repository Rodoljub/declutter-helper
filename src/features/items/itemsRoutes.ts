import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { createItem, listItems, updateDecision, getDecisionHistory } from "./itemsController";

const router = Router();
router.use(authMiddleware);

router.post("/", createItem);
router.get("/", listItems);
router.patch("/:id/decision", updateDecision);
router.get("/:id/decisions", getDecisionHistory);

export default router;
