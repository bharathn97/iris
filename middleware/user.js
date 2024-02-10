const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../db/models/Student');
const Admin = require('../db/models/Admin');
const jwtPassword = 'secretsCantBeRevealed';
const flash = require('express-flash');

// Local Strategy for Student
passport.use('student-local', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await Student.findOne({ email });
      if (!user) return done(null, false, { message: 'Invalid credentials' });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return done(null, false, { message: 'Invalid credentials' });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Local Strategy for Admin
passport.use('admin-local', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await Admin.findOne({ email });
      if (!user) return done(null, false, { message: 'Invalid credentials' });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return done(null, false, { message: 'Invalid credentials' });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(Student.createStrategy());
passport.use(Admin.createStrategy());

passport.serializeUser((user, done) => {
  done(null, { id: user.id, model: user.constructor.modelName });
});

passport.deserializeUser(async (data, done) => {
  try {
    const { id, model } = data;
    if (model === 'Student') {
      const user = await Student.findById(id);
      done(null, user);
    } else if (model === 'Admin') {
      const user = await Admin.findById(id);
      done(null, user);
    } else {
      done(new Error('Invalid user model'));
    }
  } catch (error) {
    done(error);
  }
});
const YOUR_GOOGLE_CLIENT_ID="430824929698-bc8d6shtihuve4npqmece98ifcmb9ooc.apps.googleusercontent.com";
const YOUR_GOOGLE_CLIENT_SECRET="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"
passport.use(
  new GoogleStrategy(
    {
      clientID:YOUR_GOOGLE_CLIENT_ID,
      clientSecret:YOUR_GOOGLE_CLIENT_SECRET ,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in your database
        let user = await Student.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If the user doesn't exist, create a new one
          user = new Student({
            name: profile.displayName,
            email: profile.emails[0].value,
            // Add any additional fields you want to save from the Google profile
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;
