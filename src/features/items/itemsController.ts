import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { itemService } from "./itemsService";
import { Decision } from "@prisma/client";

interface DecisionBody {
  decision: string;
  notes?: string;
}

export const createItem = async (req: AuthRequest, res: Response) => {
  const { name, category, photoUrl, notes } = req.body;
  const item = await itemService.createItem(req.user.id, { name, category, photoUrl, notes });
  res.json(item);
};

export const listItems = async (req: AuthRequest, res: Response) => {
  const items = await itemService.listItems(req.user.id);
  res.json(items);
};

export const updateDecision = async (req: AuthRequest<DecisionBody>, res: Response) => {
  const { id } = req.params;
  const { decision, notes } = req.body;

  if (!Object.values(Decision).includes(decision as Decision)) {
    return res.status(400).json({ message: "Invalid decision type" });
  }

  const updatedItem = await itemService.updateDecision(Number(id), decision as Decision, notes);
  res.json(updatedItem);
};

export const getDecisionHistory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const history = await itemService.getDecisionHistory(Number(id));
  res.json(history);
};
