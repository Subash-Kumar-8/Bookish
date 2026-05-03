import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const isproduction = process.env.NODE_ENV === "production"

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if(existing){
      return res.status(400).json({message: "User Already Exists"});
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
  });

  res.json({ message: "User created" });
  } catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
  
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: isproduction,
    sameSite: isproduction ? "none" : "lax"
  });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password)
      return res.status(400).json({message: "Password is required"});
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({message: "User Not Found"});
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({message: "Incorrect Password"});
    await User.findByIdAndDelete(userId);
    res.clearCookie("token");
    res.json({message: "Account Deleted Successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Server Error"});
  }
});

export default router;