import { Router, Response } from "express";
import { Decision, PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

interface DecisionBody {
  decision: string;
  notes?: string;
}

// Create an item
router.post("/", authMiddleware, async (req: AuthRequest<{ name: string; category: string; photoUrl?: string; notes?: string }>, res: Response) => {
  const { name, category, photoUrl, notes } = req.body;
  const item = await prisma.item.create({
    data: {
      name,
      category,
      photoUrl,
      notes,
      userId: req.user.id,
    },
  });
  res.json(item);
});

// List all items for the authenticated user
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const items = await prisma.item.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
});

// Update item decision
router.patch("/:id/decision", authMiddleware, async (req: AuthRequest<DecisionBody>, res: Response) => {
  const { id } = req.params;
  const { decision, notes } = req.body;

  // Validate decision
  if (!Object.values(Decision).includes(decision as Decision)) {
    return res.status(400).json({ message: "Invalid decision type" });
  }

  try {
    // Update the item
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        decision: decision as Decision,
        decidedAt: new Date(),
      },
    });

    // Create a decision history record
    await prisma.decisionRecord.create({
      data: {
        itemId: updatedItem.id,
        type: decision as Decision,
        notes,
      },
    });

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update decision" });
  }
});

// Get item decision history
router.get("/:id/decisions", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const history = await prisma.decisionRecord.findMany({
    where: { itemId: Number(id) },
    orderBy: { createdAt: "desc" },
  });
  res.json(history);
});

export default router;
