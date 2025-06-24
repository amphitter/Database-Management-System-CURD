const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token after "Bearer"

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
