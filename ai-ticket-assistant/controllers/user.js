import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import VerificationCode from "../models/verificationCode.js";
import { sendMail } from "../utils/mailer.js";

export const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCode.deleteMany({ email });

    await VerificationCode.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    sendMail(email, "Your Sortify verification code", `Your verification code is: ${code}\n\nThis code expires in 10 minutes.`)
      .catch((err) => console.error("sendVerificationCode — email send failed (code still saved):", err.message));

    return res.json({ message: "Verification code sent" });
  } catch (error) {
    console.error("sendVerificationCode error", error.message);
    return res.status(500).json({ error: "Failed to send code" });
  }
};

export const signup = async (req, res) => {
  const { email, password, skills = [], code } = req.body;
  try {
    if (!code) return res.status(400).json({ error: "Verification code is required" });

    const record = await VerificationCode.findOne({ email, code });
    if (!record) return res.status(400).json({ error: "Invalid or expired verification code" });
    if (record.expiresAt < new Date()) return res.status(400).json({ error: "Verification code expired" });

    await VerificationCode.deleteMany({ email });

    const hashed = await brcypt.hash(password, 10);
    const existing = await User.countDocuments();
    const role = existing === 0 ? "admin" : "user";
    const user = await User.create({ email, password: hashed, skills, role });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await brcypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorzed" });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Unauthorized" });
    });
    res.json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    await User.updateOne(
      { email },
      { skills: skills.length ? skills : user.skills, role }
    );
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};
