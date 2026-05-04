import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Wishlist from "./models/wishlist.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const app = express()

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => (console.log("DB Connected")))
.catch((err) => (console.error(err)));

app.use(cors({
  origin: ["http://localhost:5173", "https://bookish-five.vercel.app/"], 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);

const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  message: "Too many requests, try again later"
});

app.use(limiter);

const authLimiters = rateLimit({
  windowMs: 10*60*1000,
  max: 100,
  message: "Too many attemts, try again later"
});

app.use("/api/auth", authLimiters);

app.get('/', (req, res) => {
    res.send('Backend Root Working 🚀');
});

app.get('/api', (req, res) => {
    res.send('Welcome to Bookish Backend');
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Bookish Backend is running on the port ${PORT}`);
});

app.post("/api/wishlist", authMiddleware, async (req, res) => {
  try {
    const { bookId, title, author, thumbnail } = req.body;

    const exists = await Wishlist.findOne({
      bookId,
      userId: req.user.id
    });

    if (exists) return res.json({ message: "Already exists" });

    const newBook = new Wishlist({
      bookId,
      title,
      author,
      thumbnail,
      userId: req.user.id
    });

    await newBook.save();

    res.json(newBook);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/wishlist", authMiddleware, async (req, res) => {
  try {
    const books = await Wishlist.find({ userId: req.user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/wishlist/:id", authMiddleware, async (req, res) => {
  try {
    await Wishlist.deleteOne({
      bookId: req.params.id,
      userId: req.user.id
    });

    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json(err);
  }
});