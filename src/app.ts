// app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./features/auth/authRoutes";
import itemRoutes from "./features/items/itemsRoutes";

const app = express();

app.use(cors({
  origin: "http://localhost:4200", // your Angular dev server
  credentials: true, // optional, if you use cookies
}));


app.use(express.json());

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

export default app;
