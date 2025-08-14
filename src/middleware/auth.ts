import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Authenticated request type
export interface AuthRequest<Body = any, Params = any> extends Request {
  user: { id: number }; // no longer optional
  body: Body;
  params: Params;
}

// Middleware factory that ensures req.user is set
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server JWT_SECRET not set" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    // Cast req to AuthRequest so downstream routes know req.user exists
    (req as AuthRequest).user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
