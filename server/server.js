require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const apiRoutes = require("./Routes/routes");
const studentRoutes = require("./Routes/studentRoutes");
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
    origin: ["http://localhost:5173", "https://history-card5.onrender.com"],
    credentials: true,
  })
);
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
