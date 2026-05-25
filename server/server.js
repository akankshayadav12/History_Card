// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// const routes = require("./Routes/routes");

// const app = express();

// const authRoutes = require("./routes/auth");

// // ====================
// // MongoDB connection
// // ====================
// mongoose
//   .connect("mongodb://localhost:27017/hc", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB is connected successfully"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // ====================
// // Middlewares
// // ====================



// app.use("/auth", authRoutes);


// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "http://localhost:5500", // removed trailing slash
//       "http://127.0.0.1:5500"
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());

// // ====================
// // Routes
// // ====================
// app.get("/", (req, res) => {
//   res.send("🎉 Welcome to the backend server");
// });

// app.use("/", routes);

// // ====================
// // Start Server
// // ====================
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at: http://localhost:${PORT}`);
// });

// server.js
// .
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const apiRoutes = require("./Routes/routes"); // your router file
const app = express();
const PORT = 5000;
const JWT_SECRET = "supersecret123"; // you can move to .env later
const roleRoutes = require("./Routes/roleRoutes");
const studentRoutes = require("./Routes/studentRoutes");
// MongoDB connection
mongoose.connect("mongodb+srv://akanksha:akanksha_10y@cluster0.5nejvsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true,
}));
app.use(express.json());

// Basic test route
app.get("/", (req, res) => res.send("Backend running"));

// Mount API routes
app.use("/", apiRoutes);

app.use("/student", studentRoutes);
app.use("/api/roles", roleRoutes);   // 👈 now /api/roles will work
// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
