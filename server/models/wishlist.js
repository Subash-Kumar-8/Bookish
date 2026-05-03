import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    bookId: String,
    title: String,
    author: String,
    thumbnail: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

export default mongoose.model("Wishlist", wishlistSchema);