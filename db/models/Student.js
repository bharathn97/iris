const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const studentSchema = new mongoose.Schema({
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
    default: "student",
  },
});

studentSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
