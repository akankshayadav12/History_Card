// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

// optional: get user endpoint that expects Authorization header 'Bearer <token>'
router.get('/user', async (req, res) => {
  // this endpoint should probably be protected by middleware; simplified example:
  res.status(200).json({ message: 'Use GET /api/user with Authorization header and middleware to get user info' });
});

module.exports = router;
