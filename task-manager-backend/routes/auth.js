const express = require('express');
const router = express.Router();
const { register, login, getMe, deleteAccount, updateProfile,forgotPassword,resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.delete('/delete-account', protect, deleteAccount);
router.put('/update-profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;