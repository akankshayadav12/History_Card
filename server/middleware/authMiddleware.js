const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

const auth = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "No token provided",
        });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      console.log("Decoded User:", decoded);

      req.user = decoded;

      // Role check
      // Role check
if (
  allowedRoles.length > 0 &&
  !allowedRoles.includes(decoded.role)
) {
  return res.status(403).json({
    message: "Forbidden",
  });
}

next();
    } catch (err) {
      console.log("Auth Middleware Error:", err);

      return res.status(401).json({
        message: "Invalid token",
      });
    }
  };
};

module.exports = auth;
