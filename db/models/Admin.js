const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "admin",
  },
});

adminSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
