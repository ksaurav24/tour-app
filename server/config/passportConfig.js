/* eslint-disable no-undef */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET // Make sure to set this in your environment variables
};

exports.initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        if (!user.password) {
          return done(null, false, { message: 'Please login with Google' });
        }
        if (!(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.isAuthenticated = passport.authenticate('jwt', { session: false });

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URI}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, email, cb) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await new User({
            googleId: email.id,
            email: email.emails[0].value,
            firstName: email.name.givenName,
            profilePicture: email._json.picture,
            username: email.emails[0].value.split('@')[0],
            isVerified: true,
          }).save();
        }
        const token = exports.generateToken(user);
        return cb(null, { user, token });
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

// Remove serializeUser and deserializeUser as they are not needed for JWT
