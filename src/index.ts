// src/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Create user
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = await prisma.user.create({ data: { name, email, password } });
  res.json(user);
});

// Login (fake token for now)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: 'FAKE-TOKEN', userId: user.id });
});

// Get all items for a user
app.get('/items/:userId', async (req, res) => {
  const items = await prisma.item.findMany({
    where: { userId: Number(req.params.userId) },
  });
  res.json(items);
});

// Add item
app.post('/items', async (req, res) => {
  const { name, category, userId } = req.body;
  const item = await prisma.item.create({
    data: { name, category, userId },
  });
  res.json(item);
});

app.listen(3000, () => console.log(`🚀 Server ready on http://localhost:3000`));
