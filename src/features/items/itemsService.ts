import { PrismaClient, Decision } from "@prisma/client";

const prisma = new PrismaClient();

export const itemService = {
  createItem: (userId: number, data: { name: string; category: string; photoUrl?: string; notes?: string }) =>
    prisma.item.create({ data: { ...data, userId } }),

  listItems: (userId: number) =>
    prisma.item.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),

  updateDecision: async (itemId: number, decision: Decision, notes?: string) => {
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { decision, decidedAt: new Date() },
    });

    await prisma.decisionRecord.create({
      data: { itemId: updatedItem.id, type: decision, notes },
    });

    return updatedItem;
  },

  getDecisionHistory: (itemId: number) =>
    prisma.decisionRecord.findMany({ where: { itemId }, orderBy: { createdAt: "desc" } }),
};
