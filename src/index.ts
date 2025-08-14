import express from "express";
import authRoutes from "./features/auth/authRoutes";
import itemRoutes from "./features/items/itemsRoutes";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
