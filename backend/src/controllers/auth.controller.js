import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { email, password, companyName } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashed, companyName });

    // Generate token for automatic login after registration
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Registered",
      token,
      user: { id: user._id, email: user.email, companyName: user.companyName }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Logged in",
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    // User is already attached by authenticate middleware
    res.json({
      user: { id: req.user._id, email: req.user.email, companyName: req.user.companyName, logoUrl: req.user.logoUrl, 
        address: req.user.companyAddress, vatNumber: req.user.vatNumber }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
