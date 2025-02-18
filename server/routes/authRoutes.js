const express = require('express');

const router = express.Router();

const passport = require('passport');

const { registerUser, logoutUser, checkUsername, sendResetPasswordEmail, resetPassword, verifyMail, loginUser } = require('../controller/authController');

const ApiResponse = require('../utils/ApiResponse');
const { registrationInputValidation, passwordInputValidation, loginInputValidation } = require('../middleware/inputValidation');

router.post(
    "/login",
    loginInputValidation,
    loginUser
  );
  
router.get("/logout",logoutUser);


router.post('/register',registrationInputValidation,registerUser)

router.post('/send-reset-password-mail',sendResetPasswordEmail)

router.post('/reset-password',passwordInputValidation,resetPassword)

router.get('/verify-mail/:token',verifyMail)


router.get("/login/failed", (req, res) => {
  res.status(401).send(new ApiResponse(
    401,null,"failed to login"
  ))
});


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // eslint-disable-next-line no-undef
    successRedirect: process.env.CLIENT_URI,
    // eslint-disable-next-line no-undef
    failureRedirect: `${process.env.CLIENT_URI}/login`,
  })
);

router.post('/checkUsername',checkUsername)

module.exports = router;
