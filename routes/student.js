const express = require('express');
const passport = require('../middleware/user'); // Import your Passport configuration
const jwt = require('jsonwebtoken');
const jwtPassword = 'secretsCantBeRevealed';
const Student = require('../db/models/Student');
const { checkRole,validateUser,assignRole } = require('../middleware/checkRole');
const bcrypt = require('bcryptjs');
const router = express.Router();
  const path = require('path');
  router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/student-signup.html'));
  });
  router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/student-login.html'));
  });
  router.get('/dashboard',(req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin-dashboard.html'));
  });
router.post("/signup", function (req, res) {
  console.log("username"+req.body.username);
  console.log("e"+req.body.email);
  Student.register(
    { username: req.body.username, email: req.body.email }, // Include email in the request body
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("studentlocal")(req, res, function () {
          res.redirect('/student/dashboard');
        });
      }
    }
  );
});

// router.post(
//   '/login',
//   passport.authenticate('student-local', {
//     // Remove successRedirect and handle success here
//     successFlash: 'Successfully logged in', // Optional: You can use flash messages for displaying success messages
//     failureRedirect: '/login',
//     failureFlash: true,
//   }),
//   (req, res) => {
//     res.redirect('/admin/dashboard');
//   }
// );
router.post("/login", function (req, res) {
  const user = new Student({
    email: req.body.email,
    password: req.body.password,
  });

  console.log("Hello " + user.email);

  Student.findOne({ email: user.email }).then((foundUser) => {
    if (foundUser) {
      console.log("Hello");

      // Check the password using bcrypt.compare
      bcrypt.compare(req.body.password, foundUser.password, function (err, result) {
        if (result) {
          req.login(foundUser, function (err) {
            if (err) {
              console.log(err);
              res.redirect("/loginstudent");
            } else {
              passport.authenticate("student-local")(req, res, function () {
                console.log("Success");
                res.redirect("/student/dashboard");
              });
            }
          });
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.redirect("/login");
    }
  });
});

// router.get(
//   '/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );
//
// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login',
//   })
// );

module.exports = router;
