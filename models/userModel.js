var mongoose = require("mongoose");

var db = require("../routes/database");
// create an schema
var userSchema = new mongoose.Schema(
  {
    full_name: String,
    email: String,
    password: String
  },
  {
    collection: "users"
  }
);
var model = mongoose.model("model", userSchema);

module.exports = model;
