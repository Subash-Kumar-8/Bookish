import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    bookId: String,
    title: String,
    author: String,
    thumbnail: String
});

export default mongoose.model("Wishlist", wishlistSchema);