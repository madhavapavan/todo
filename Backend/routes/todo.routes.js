import express from "express";
import Todo from "../models/todos.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get all todos for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, priority, category } = req.body;
    if (!text || !priority) {
      return res.status(400).json({ message: "Text and priority are required" });
    }
    const todo = new Todo({
      text,
      priority,
      category: category || null,
      userId: req.userId,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a todo
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, priority, category, completed } = req.body;
    const todo = await Todo.findOne({ _id: id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    if (text !== undefined) todo.text = text;
    if (priority !== undefined) todo.priority = priority;
    if (category !== undefined) todo.category = category;
    if (completed !== undefined) todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;