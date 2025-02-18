const zod = require('zod');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const registerUserSchema = zod.object({
    username: zod.string().min(3).max(20),
    email: zod.string().email(),
    password: zod.string().min(8),
    firstName: zod.string().min(2),
    lastName: zod.string().min(2).optional(),
});

const loginUserSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(1),
});

const passwordSchema = zod.string().min(8).max(20).includes(zod.string().min(1, "Password must contain at least one letter").max(1, "Password must contain at least one letter").regex(/[a-zA-Z]/, "Password must contain at least one letter").min(1, "Password must contain at least one number").max(1, "Password must contain at least one number").regex(/[0-9]/, "Password must contain at least one number"));

const registrationInputValidation = asyncHandler(async (req, res, next) => {
    try {
        registerUserSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).send(new ApiResponse(400, null, "Invalid input", error.errors));
    }   
});

const loginInputValidation = asyncHandler(async (req, res, next) => {
    try {
        loginUserSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).send(new ApiResponse(400, null, "Invalid input", error.errors));
    }
});

const passwordInputValidation = asyncHandler(async (req, res, next) => {
    try {
        passwordSchema.parse(req.body.password);
        next();
    } catch (error) {
        return res.status(400).send(new ApiResponse(400, null, "Invalid input", error.errors));
    }
});

module.exports = {
    passwordInputValidation,
    registrationInputValidation,
    loginInputValidation
};
