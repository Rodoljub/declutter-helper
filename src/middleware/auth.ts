// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    // (req as any).userId = decoded.userId;

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; iat: number; exp: number };
    req.user = { id: payload.userId,}; // attach user here

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
