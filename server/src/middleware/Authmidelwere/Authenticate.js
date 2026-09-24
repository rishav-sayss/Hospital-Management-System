import jwt from "jsonwebtoken";
import User from "../../models/Authmodel/Usermodel.js";

// Verifies the access token cookie and attaches the logged-in user to req.user.
// Any route that needs a logged-in user should use this first.
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
 
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

 

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    req.user = user; // password is excluded automatically (select: false on the field)
   
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
