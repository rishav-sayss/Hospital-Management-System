import User from "../../models/Authmodel/Usermodel.js";
import RefreshToken from "../../models/Authmodel/RefTokenmodel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../../utils/generateTokens.js";
import { setAuthCookies, clearAuthCookies } from "../../utils/tokenCookie.js";

 

// @route  POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const allowedRoles = ["admin", "doctor", "patient", "receptionist"];
    const finalRole = allowedRoles.includes(role) ? role : "patient";

    const user = await User.create({ name, email, password, role: finalRole });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: { message: "Registration successful",id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// @route  POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      user: { message: "Login successful", id: user._id, name: user.name, email: user.email, role: user.role,  },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// @route  POST /api/auth/refresh
export const refresh = async (req, res) => {
  try {
    const incomingToken = req.cookies?.refreshToken;
    // console.log(incomingToken)
    if (!incomingToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const hashedIncoming = hashToken(incomingToken);
    const storedToken = await RefreshToken.findOne({ token: hashedIncoming });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh token invalid or expired" });
    }

    const user = await User.findById(storedToken.user);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    storedToken.revoked = true;
    await storedToken.save();

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);
    setAuthCookies(res, accessToken, newRefreshToken);

    res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    res.status(500).json({ message: "Could not refresh token", error: err.message });
  }
};

// @route  POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const incomingToken = req.cookies?.refreshToken;
    if (incomingToken) {
      await RefreshToken.updateOne(
        { token: hashToken(incomingToken) },
        { revoked: true }
      );
    }
    clearAuthCookies(res);
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

// @route  GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
