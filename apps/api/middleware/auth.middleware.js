const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || "fallback_access_secret");
    req.user = decoded; // Contains id from the token
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = { requireAuth };
