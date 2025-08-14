import { Request, Response } from "express";
import { authService } from "./authService";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signup(name, email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
