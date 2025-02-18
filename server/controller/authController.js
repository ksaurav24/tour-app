/* eslint-disable no-undef */
const User = require("../models/userModel");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const sendMail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const getLogger = require("../utils/logger");

const logger = getLogger('AuthController');

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        logger.info('Attempting to login user', { email });

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('Login attempt with non-existent email', { email });
            return res.status(404).send(new ApiResponse(404, null, "User not found"));
        }

        const comparePassword = await bcrypt.compare(password, user.passwordHash);
        if (!comparePassword) {
            logger.warn('Incorrect password', { email });
            return res.status(401).send(new ApiResponse(401, null, "Incorrect password"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const newUser = await User.findById(user._id).select('-passwordHash -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry');

        logger.info('User logged in successfully', { userId: user._id });
        res.status(200).send(new ApiResponse(200, {
            user: newUser,
            token
        }, "User logged in successfully"));

    } catch (error) {
        console.log(error)
        logger.error('Error logging in user', { email: req.body.email, error: error.message });
        res.status(500).send(new ApiResponse(500, null, "Internal server error"));
    }
});

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email, password, firstName, lastName, dateOfBirth, userName } = req.body;
        logger.info('Attempting to register new user', { email, userName });

        const userExists = await User.findOne({ email });
        if (userExists) {
            logger.warn('Registration attempt with existing email', { email });
            return res.status(400).send(new ApiResponse(400, null, "User already exists"));
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const token = uuidv4();
        const verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        const user = await User.create({
            email,
            passwordHash,
            firstName,
            lastName,
            dateOfBirth,
            userName,
            verificationToken: token,
            verificationTokenExpiry
        });

        const verifyUrl = `${process.env.CLIENT_URI}/verify/?token=${token}`;
        await sendMail({
            to: email,
            emailType: "VERIFY",
            url: verifyUrl
        });

        logger.info('User registered successfully', { userId: user._id, email });
        res.status(201).send(new ApiResponse(201, user, "User created successfully, please verify your email"));
    } catch (error) {
        logger.error('Error in user registration', { error: error.message });
        res.status(500).send(new ApiResponse(500, null, "Internal server error"));
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        logger.info('User logging out', { userId: req.user?._id });
        // Passport's req.logout is asynchronous and requires a callback
        req.logout(function(err) {
            if (err) {
                logger.error('Error during logout', { userId: req.user?._id, error: err.message });
                return res.status(500).send(new ApiResponse(500, null, "Internal server error"));
            }
            logger.info('User logged out successfully', { userId: req.user?._id });
            res.status(200).send(new ApiResponse(200, null, "Logout successful"));
        });
    } catch (error) {
        logger.error('Error during logout', { userId: req.user?._id, error: error.message });
        res.status(500).send(new ApiResponse(500, null, "Internal server error"));
    }
});

const checkUsername = asyncHandler(async (req, res) => {
    try {
        const { userName } = req.body;
        logger.info('Checking username availability', { userName });

        const userNameExists = await User.findOne({ userName });
        if (userNameExists) {
            logger.info('Username already exists', { userName });
            return res.status(400).send(new ApiResponse(400, null, "Username already exists"));
        }

        logger.info('Username is available', { userName });
        res.status(200).send(new ApiResponse(200, null, "Username is available"));
    } catch (error) {
        logger.error('Error checking username', { userName: req.body.userName, error: error.message });
        res.status(500).send(new ApiResponse(500, null, "Internal server error"));
    }
});

const sendResetPasswordEmail = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        logger.info('Sending reset password email', { email });

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('Reset password attempt for non-existent user', { email });
            return res.status(404).send(new ApiResponse(404, null, "User not found"));
        }

        const token = uuidv4();
        user.resetPasswordToken = token;
        user.resetPasswordTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        const resetPasswordLink = `${process.env.CLIENT_URI}/resetPassword/?token=${token}`;
        await sendMail({
            to: email,
            emailType: "RESET_PASSWORD",
            url: resetPasswordLink
        });

        logger.info('Reset password email sent', { email });
        res.status(200).send(new ApiResponse(200, null, "Reset password link sent to your email"));
    } catch (error) {
        logger.error('Error sending reset password email', { email: req.body.email, error: error.message });
        res.status(500).send(new ApiResponse(500, null, "Internal server error"));
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { token, password } = req.body;
        logger.info('Attempting to reset password', { token });

        const user = await User.findOne({ resetPasswordToken: token });
        if (!user) {
            logger.warn('Invalid reset password token', { token });
            return res.status(404).send(new ApiResponse(404, null, "User not found"));
        }

        if (user.resetPasswordTokenExpiry < new Date()) {
            logger.warn('Expired reset password token', { token, userId: user._id });
            return res.status(400).send(new ApiResponse(400, null, "Token has expired"));
        }

        const comparePassword = await bcrypt.compare(password, user.passwordHash);
        if (comparePassword) {
            logger.warn('Attempt to use same password for reset', { userId: user._id });
            return res.status(400).send(new ApiResponse(400, null, "Cannot use the same password"));
        }

        const newPasswordHash = await bcrypt.hash(password, 10);
        user.passwordHash = newPasswordHash;
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpiry = null;
        await user.save();

        logger.info('Password reset successful', { userId: user._id });
        res.status(200).send(new ApiResponse(200, null, "Password reset successful"));
    } catch (error) {
        logger.error('Error resetting password', { token: req.body.token, error: error.message });
        res.status(500).send(new ApiResponse(500, null, "Internal server error"));
    }
});

const verifyMail = asyncHandler(async (req, res) => {
    try {
        const { token } = req.params;
        logger.info('Attempting to verify email', { token });

        if (!token) {
            logger.warn('Email verification attempt without token');
            return res.status(400).send(new ApiResponse(400, null, "Invalid Token"));
        }

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            logger.warn('Email verification attempt with invalid token', { token });
            return res.status(404).send(new ApiResponse(404, null, "User not found"));
        }

        if (user.verificationTokenExpiry < new Date()) {
            logger.warn('Expired email verification token', { token, userId: user._id });
            return res.status(400).send(new ApiResponse(400, null, "Token has expired"));
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();

        logger.info('Email verified successfully', { userId: user._id });
        res.status(200).send(new ApiResponse(200, user, "User verified successfully"));
    } catch (error) {
        logger.error('Error verifying email', { token: req.params.token, error: error.message });
        res.status(500).send(new ApiResponse(500, null, "Internal server error"));
    }
});

module.exports = {
    registerUser,
    resetPassword,
    verifyMail,
    checkUsername,
    logoutUser,
    loginUser,
    sendResetPasswordEmail
};
