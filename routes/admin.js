const express = require('express');
const passport = require('../middleware/user'); // Import your Passport configuration
const jwt = require('jsonwebtoken');
const jwtPassword = 'secretsCantBeRevealed';
const Admin = require('../db/models/Admin');
const { checkRole,validateUser,assignRole } = require('../middleware/user');

const router = express.Router();
const path = require('path');
// const checkAdminRole = checkRole(['admin']);
// router.use(assignRole); // Assign the role to the request object
// router.use(validateUser); // Validate the user based on the assigned role

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-signup.html'));
});
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-login.html'));
});
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-dashboard.html'));
});
router.post("/signup", function (req, res) {
  console.log("username"+req.body.username);
  console.log("e"+req.body.email);
  Admin.register(
    { username: req.body.username, email: req.body.email }, // Include email in the request body
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {

          res.redirect('/admin/dashboard'); // Redirect to /admin/dashboard on successful signup
        });
      }
    }
  );
});

router.post("/login", function (req, res) {
  console.log("username"+req.body.username);
  console.log("password"+req.body.password);
  const user = new Admin({
    email: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) console.log(err);
    else
      passport.authenticate("admin-local")(req, res, function () {
        console.log("Successfully logged in");
        res.redirect("/admin/dashboard");
      });
  });
});

//
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
