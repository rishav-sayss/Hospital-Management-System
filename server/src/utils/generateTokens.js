import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/Authmodel/RefTokenmodel.js";
// Short-lived access token (JWT) — carries id and role, used to authenticate every request
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );
};


// Creates a refresh token, stores its hash in the DB against the user, and returns the raw token
export const generateRefreshToken = async (user) => {
  const refreshToken =  crypto.randomBytes(40).toString("hex");;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    user: user._id,
    token: hashToken(refreshToken),
    expiresAt,
  });

  return refreshToken;
};

 

// One-way hash used before storing/comparing refresh tokens
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
