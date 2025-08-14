import { PrismaClient, Decision } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateItemInput {
  name: string;
  category: string;
  photoUrl?: string;
  notes?: string;
}

export const itemService = {
  createItem: async (userId: number, data: CreateItemInput) => {
    return prisma.item.create({
      data: {
        userId,
        ...data,
      },
    });
  },

  listItems: async (userId: number) => {
    return prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  updateDecision: async (itemId: number, decision: Decision, notes?: string) => {
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        decision,
        decidedAt: new Date(),
      },
    });

    await prisma.decisionRecord.create({
      data: {
        itemId: updatedItem.id,
        type: decision,
        notes: notes || "",
      },
    });

    return updatedItem;
  },

  getDecisionHistory: async (itemId: number) => {
    return prisma.decisionRecord.findMany({
      where: { itemId },
      orderBy: { createdAt: "desc" },
    });
  },
};
