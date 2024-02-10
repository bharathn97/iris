const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;
const flash = require('express-flash');
const session = require('express-session');
const connectToMongoose = require("./db/index");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
app.use(cors());
app.use(express.json());
const path = require("path"); // Import the 'path' module
connectToMongoose();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use("/student", require("./routes/student"));
app.use("/admin", require("./routes/admin"));


app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
