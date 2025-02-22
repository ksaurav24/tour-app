const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, logoutUser, checkUsername, sendResetPasswordEmail, resetPassword, verifyMail, loginUser } = require('../controller/authController');
const ApiResponse = require('../utils/ApiResponse');
const { registrationInputValidation, passwordInputValidation, loginInputValidation } = require('../middleware/inputValidation');

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */
router.post("/login", loginInputValidation, loginUser);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.get("/logout", logoutUser);


// const registerUserSchema = zod.object({
//     username: zod.string().min(3).max(20),
//     email: zod.string().email(),
//     password: zod.string().min(8),
//     firstName: zod.string().min(2),
//     lastName: zod.string().min(2).optional(),
// });
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *              email:  
 *               type: string
 *              password:
 * type:string
 * firstName:
 * type:String
  * lastName:
  * type:String 
  * optional:true
 * 
 * 
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', registrationInputValidation, registerUser);

/**
 * @swagger
 * /api/v1/auth/send-reset-password-mail:
 *   post:
 *     summary: Send reset password email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset password email sent
 *       404:
 *         description: User not found
 */
router.post('/send-reset-password-mail', sendResetPasswordEmail);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', passwordInputValidation, resetPassword);

/**
 * @swagger
 * /api/v1/auth/verify-mail/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify-mail/:token', verifyMail);

/**
 * @swagger
 * /api/v1/auth/login/failed:
 *   get:
 *     summary: Failed login response
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: Failed to login
 */
router.get("/login/failed", (req, res) => {
  res.status(401).send(new ApiResponse(401, null, "failed to login"));
});

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Initiate Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to client URI on success or login page on failure
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // eslint-disable-next-line no-undef
    successRedirect: process.env.CLIENT_URI,
    // eslint-disable-next-line no-undef
    failureRedirect: `${process.env.CLIENT_URI}/login`,
  })
);

/**
 * @swagger
 * /api/v1/auth/checkUsername:
 *   post:
 *     summary: Check if username is available
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username availability status
 *         
 * 
 */
router.post('/checkUsername', checkUsername);

module.exports = router;
