
const router = require('express').Router()
router.get("/test", (req, res) => {
  res.json({ message: "Routes working" });
});
const studentCtrl = require("../controllers/studentControllers");
const teacherControllers = require("../controllers/teacherControllers");
const courseCtrl = require("../controllers/courseControllers");
const hcrCtrl = require("../controllers/hcrControllers");
const authCtrl = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");

const roleController = require("../controllers/userRoleController");

const { getFacultyStudents } = require("../controllers/studentControllers");

// GET all roles
router.get("/roles", roleController.getRoles);

// Add role
router.post("/roles", roleController.addRole);

// Update role
router.put("/roles/:id", roleController.updateRole);

// Delete role
router.delete("/roles/:id", roleController.deleteRole);


// Login and Signup routes
router.post("/signup", authCtrl.signup);

// Login
router.post("/login", authCtrl.login);

// Students
router.post("/students", studentCtrl.createStudent);
router.get("/students", studentCtrl.getAllStudents);
router.get(
  "/student/dashboard",
  auth(["student"]),
  studentCtrl.getStudentDashboard
);
router.get("/students/:id", studentCtrl.getStudentById);
router.put("/students/:id", studentCtrl.updateStudent);
router.get("/students/my", auth(["faculty"]), studentCtrl.getMyStudents);
router.delete("/students/:id", studentCtrl.deleteStudent);



// HCRs
router.post("/hcr", hcrCtrl.createHCR);

// Get ALL HCRs
router.get("/hcr", hcrCtrl.getAllHCRs);

// Get HCRs of a particular student
router.get("/hcr/student/:studentId", hcrCtrl.getHCRsByStudent);

// Get HCR by ID
router.get("/hcr/:id", hcrCtrl.getHCRById);

// Update HCR
router.put("/hcr/:id", hcrCtrl.updateHCR);

// Delete HCR
router.delete("/hcr/:id", hcrCtrl.deleteHCR);

// Courses
router.post("/courses", courseCtrl.createCourse);
router.get("/courses", courseCtrl.getAllCourses);
router.get("/courses/:id", courseCtrl.getCourseById);
router.put("/courses/:id", courseCtrl.updateCourse);
router.delete("/courses/:id", courseCtrl.deleteCourse);


// Teacher 
router.post("/teachers/", teacherControllers.createTeacher);
router.get("/teachers", teacherControllers.getTeachers);
router.get("/teachers/:id", teacherControllers.getTeacherById);
router.put("/teachers/:id", teacherControllers.updateTeacher);
router.delete("/teachers/:id", teacherControllers.deleteTeacher);
// router.get("teachers/:facultyId", studentCtrl.getFacultyStudents);
// router.get("/teachers/:facultyId/students", studentCtrl.getFacultyStudents);
router.get("/teachers/:facultyId/students", studentCtrl.getFacultyStudents);
router.get("/teachers/:id/students", teacherControllers.getTeacherStudents);

module.exports = router


