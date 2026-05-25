// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const apiRoutes = require("./Routes/routes");
// const roleRoutes = require("./Routes/roleRoutes");
// const studentRoutes = require("./Routes/studentRoutes");

// const app = express();

// const PORT = process.env.PORT || 5000;

// // MongoDB connection (FIXED)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//   })
//   .catch(err => {
//     console.log("❌ MongoDB error:");
//     console.log(err);
//   });

// // Middleware
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));
// app.use(express.json());

// // Routes
// app.get("/", (req, res) => res.send("Backend running"));

// app.use("/", apiRoutes);
// app.use("/student", studentRoutes);
// app.use("/api/roles", roleRoutes);

// // Start server
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );








// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const apiRoutes = require("./Routes/routes");
// const roleRoutes = require("./Routes/routes");
// const studentRoutes = require("./Routes/studentRoutes");

// const app = express();

// const PORT = process.env.PORT || 5000;

// // MongoDB connection (KEEP AS IT IS — DO NOT CHANGE)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//   })
//   .catch(err => {
//     console.log("❌ MongoDB error:");
//     console.log(err);
//   });

// // Middleware
// app.use(cors({
//     origin: [
//     "http://localhost:5173",
//     "http://localhost:3000",
//     "https://your-frontend.vercel.app" // 👈 change this later
//   ],
//   credentials: true,
// }));
// app.use(express.json());

// // Health check
// app.get("/", (req, res) => res.send("Backend running"));

// /*
//   ✅ FIXED ROUTE STRUCTURE
//   Everything now under /api
//   (frontend becomes easier + deployment safe)
// */

// app.use("/api", apiRoutes);

// // keep studentRoutes ONLY if it contains special logic
// // but we prefix it properly to avoid confusion
// app.use("/api/student", studentRoutes);

// // app.use("/api/roles", roleRoutes);

// // Start server
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );
// const path = require("path");

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
//   });
// }




require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiRoutes = require("./Routes/routes");
const studentRoutes = require("./Routes/studentRoutes");
<<<<<<< HEAD
const UserRole = require("./models/UserRoleModel");

const app = express();

const PORT = process.env.PORT || 5000;

/*
========================================
DEFAULT ROLE SEEDER
========================================
*/

const seedRoles = async () => {
  try {
    const roles = [
      {
        roleName: "admin",
        permissions: [
          "manage_students",
          "manage_teachers",
          "manage_courses",
          "manage_hcr",
          "manage_roles",
        ],
      },
      {
        roleName: "faculty",
        permissions: [
          "view_students",
          "manage_hcr",
        ],
      },
      {
        roleName: "student",
        permissions: [
          "view_own_profile",
          "view_own_hcr",
        ],
      },
    ];

    for (const role of roles) {
      const exists = await UserRole.findOne({
        roleName: role.roleName,
      });

      if (!exists) {
        await UserRole.create(role);
        console.log(`✅ Role created: ${role.roleName}`);
      }
    }
  } catch (err) {
    console.log("❌ Error seeding roles:");
    console.log(err.message);
  }
};

/*
========================================
MONGODB CONNECTION
========================================
*/

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected successfully");

    await seedRoles();
  })
  .catch((err) => {
    console.log("❌ MongoDB error:");
    console.log(err);
  });

/*
========================================
MIDDLEWARE
========================================
*/

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
=======
// MongoDB connection
MONGO_URI=mongodb+srv://username:password@cluster0.xxxx.mongodb.net/hcrdb
PORT=5000
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));
>>>>>>> 6fd3814784eff03936964ab446ad968318d65932

app.use(express.json());

/*
========================================
HEALTH CHECK
========================================
*/

app.get("/", (req, res) => {
  res.send("Backend running");
});

/*
========================================
ROUTES
========================================
*/

app.use("/api", apiRoutes);

app.use("/api/student", studentRoutes);

/*
========================================
START SERVER
========================================
*/

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});