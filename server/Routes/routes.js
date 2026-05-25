
const router = require('express').Router()

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


// Login and Signup routes
router.post("/signup", authCtrl.signup);

// Login
router.post("/login", authCtrl.login);

// Students
router.post("/students", studentCtrl.createStudent);
router.get("/students", studentCtrl.getAllStudents);
router.get("/students/:id", studentCtrl.getStudentById);
router.put("/students/:id", studentCtrl.updateStudent);
router.get("/students/my", auth(["student"]), studentCtrl.getMyStudents);
router.delete("/students/:id", studentCtrl.deleteStudent);
router.get("/student/dashboard", auth(["student"]), studentCtrl.getStudentDashboard);



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



//

// const router = require('express').Router();

// const studentCtrl = require("../controllers/studentControllers");
// const teacherCtrl = require("../controllers/teacherControllers");
// const courseCtrl = require("../controllers/courseControllers");
// const hcrCtrl = require("../controllers/hcrControllers");
// const authCtrl = require("../controllers/authController");

// const auth = require("../middleware/authMiddleware"); // <-- Import auth middleware

// // Auth routes
// router.post("/auth/signup", authCtrl.signup);
// router.post("/auth/login", authCtrl.login);

// // Students
// router.post("/students", auth(["admin","faculty"]), studentCtrl.createStudent); // Only admin/faculty can create
// router.get("/students", auth(["admin"]), studentCtrl.getAllStudents);           // Only admin sees all students
// router.get("/students/faculty", auth(["faculty","admin"]), studentCtrl.getFacultyStudents); // Faculty sees own students
// router.get("/students/:id", auth(["admin","faculty","student"]), studentCtrl.getStudentById); // faculty/admin/student can see based on logic
// router.put("/students/:id", auth(["admin","faculty"]), studentCtrl.updateStudent);
// router.delete("/students/:id", auth(["admin","faculty"]), studentCtrl.deleteStudent);

// // Teachers
// router.post("/teachers", auth(["admin"]), teacherCtrl.createTeacher); // Only admin
// router.get("/teachers", auth(["admin"]), teacherCtrl.getTeachers);     // Only admin
// router.get("/teachers/:id", auth(["admin","faculty"]), teacherCtrl.getTeacherById); // maybe faculty can view
// router.put("/teachers/:id", auth(["admin"]), teacherCtrl.updateTeacher);
// router.delete("/teachers/:id", auth(["admin"]), teacherCtrl.deleteTeacher);

// // Courses
// router.post("/courses", auth(["admin","faculty"]), courseCtrl.createCourse); // admin+faculty
// router.get("/courses", auth(["admin","faculty","student"]), courseCtrl.getAllCourses);
// router.get("/courses/:id", auth(["admin","faculty","student"]), courseCtrl.getCourseById);
// router.put("/courses/:id", auth(["admin","faculty"]), courseCtrl.updateCourse);
// router.delete("/courses/:id", auth(["admin","faculty"]), courseCtrl.deleteCourse);

// // HCRs
// router.post("/hcr", auth(["admin","faculty","student"]), hcrCtrl.createHCR); // student can create own HCR
// router.get("/hcr", auth(["admin","faculty"]), hcrCtrl.getAllHCRs);           // admin/faculty sees all
// router.get("/hcr/:id", auth(["admin","faculty","student"]), hcrCtrl.getHCRById);
// router.get("/hcr/student/:studentId", auth(["admin","faculty","student"]), hcrCtrl.getHCRsByStudent);
// router.put("/hcr/:id", auth(["admin","faculty"]), hcrCtrl.updateHCR);
// router.delete("/hcr/:id", auth(["admin","faculty"]), hcrCtrl.deleteHCR);

// module.exports = router;
