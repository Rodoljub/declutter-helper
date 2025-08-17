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

  getItemById: async (itemId: number) => {
    return prisma.item.findUnique({
      where: { id: itemId },
    });
  },

  updateItem: async (id: number, data: { name: string; category: string }) => {
    return prisma.item.update({
      where: { id },
      data,
    });
  },

  deleteItem: async (itemId: number) => {
    // Delete all related DecisionRecords first
    await prisma.decisionRecord.deleteMany({ where: { itemId } });
    return prisma.item.delete({ where: { id: itemId } });
  },

  updateDecision: async (
    itemId: number,
    decision: Decision,
    notes?: string
  ) => {
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

  getDecisionStats: async (userId: number) => {
    const stats = await prisma.item.groupBy({
      by: ["decision"],
      where: { userId: userId },
      _count: { decision: true },
    });

    // Transform result into easy-to-use object
    const result: Record<string, number> = {
      KEEP: 0,
      DONATE: 0,
      SELL: 0,
      TRASH: 0,
    };

    stats.forEach((s) => {
      if (s.decision) result[s.decision] = s._count.decision;
    });

    return result;
  },

  getDailyDecisionStats: async (userId: number, days: number = 7) => {
    // Get decisions for the last `days` days
    const since = new Date();
    since.setDate(since.getDate() - days);

    const decisions = await prisma.item.findMany({
      where: {
        userId: userId,
        decidedAt: { gte: since },
      },
      select: { decidedAt: true },
    });

    // Group by day
    const dailyStats: Record<string, number> = {};

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dailyStats[key] = 0;
    }

    decisions.forEach((item) => {
      const key = item.decidedAt!.toISOString().split("T")[0];
      if (dailyStats[key] !== undefined) {
        dailyStats[key] += 1;
      }
    });

    return dailyStats;
  },
};
