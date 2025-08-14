import { Request, Response } from "express";
import { itemService } from "./itemsService";
import { Decision } from "@prisma/client";

export const itemController = {
  createItem: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId; // set from auth middleware
      const { name, category, photoUrl, notes } = req.body;

      if (!name || !category) {
        return res.status(400).json({ message: "Name and category are required" });
      }

      const item = await itemService.createItem(userId, { name, category, photoUrl, notes });
      return res.status(201).json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to create item" });
    }
  },

  listItems: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const items = await itemService.listItems(userId);
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch items" });
    }
  },

  updateDecision: async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const { decision, notes } = req.body;

      if (!Object.values(Decision).includes(decision)) {
        return res.status(400).json({ message: "Invalid decision value" });
      }

      const updatedItem = await itemService.updateDecision(Number(itemId), decision, notes);
      return res.json(updatedItem);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update decision" });
    }
  },

  getDecisionHistory: async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const history = await itemService.getDecisionHistory(Number(itemId));
      return res.json(history);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch decision history" });
    }
  },
};
