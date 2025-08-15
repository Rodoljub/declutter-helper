import { Router } from "express";
import { body } from "express-validator";
import { itemController } from "./itemsController";
import { authMiddleware } from "../../middleware/auth"; // you need JWT check

const router = Router();

// Protect all routes
router.use(authMiddleware);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  itemController.createItem
);

router.get("/", itemController.listItems);

router.patch(
  "/:itemId/decision",
  [
    body("decision").notEmpty().withMessage("Decision is required"),
  ],
  itemController.updateDecision
);

router.get("/:itemId/history", itemController.getDecisionHistory);

export default router;
