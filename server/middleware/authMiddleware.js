const jwt = require("jsonwebtoken");

const auth = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Invalid token" });
      }

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: Insufficient role" });
      }

      req.user = decoded;
      next();
    });
  };
};

module.exports = auth;
