import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
//CREATE TOKEN
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const TOKEN_EXPIRATION = "24h";
const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });
};

//REGISTER FUNCTION
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All field are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be atleast of 8 characters",
    });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//LOGIN FUNCTION
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All field are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//GET CURRENT USER FUNCTION
export async function getCurrentUser(req, res) {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("name email");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//UPDATE USER PROFILE FUNCTION
export async function updateUserProfile(req, res) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "All field are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
        select: "name email",
      }
    );
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

//UPDATE USER PASSWORD FUNCTION
export async function updateUserPassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All field are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be atleast of 8 characters",
    });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
