import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Wishlist from "./models/wishlist.js";

const app = express()

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => (console.log("DB Connected")))
.catch((err) => (console.error(err)));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend Root Working 🚀');
});

app.get('/api', (req, res) => {
    res.send('Welcome to Bookish Backend');
})

app.listen(5000, () => {
    console.log("Bookish Backend is running");
});

app.post("/api/wishlist", async (req, res) => {
  try {
    const { bookId, title, author, thumbnail } = req.body;

    const exists = await Wishlist.findOne({ bookId });
    if (exists) return res.json({ message: "Already exists" });

    const newBook = new Wishlist({
      bookId,
      title,
      author,
      thumbnail
    });

    await newBook.save();

    res.json(newBook);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/wishlist", async (req, res) => {
  try {
    const books = await Wishlist.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/wishlist/:id", async (req, res) => {
  try {
    await Wishlist.deleteOne({ bookId: req.params.id });
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/images", async (req, res) => {
  const query = req.query.q;

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${query}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    }
  );

  const data = await response.json();
  res.json(data);
});