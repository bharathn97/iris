const mongoose = require("mongoose");

async function connectToMongoose() {
  await mongoose.connect("mongodb://0.0.0.0:27017/IRIS_Course_Registration");
  console.log("Connected to MongoDB database");
}

module.exports = connectToMongoose;
