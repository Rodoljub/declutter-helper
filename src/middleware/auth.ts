import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest<Body = any, Params = any, Query = any>
  extends Request<Params, any, Body, Query> {
  user: { id: number };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server JWT_SECRET not set" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    (req as AuthRequest).user = { id: decoded.id };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};
