var mongoose = require("mongoose");
var db = require("../routes/database");
// create an schema
var userSchema = new mongoose.Schema(
  {
    full_name: String,
    email_address: String,
    password: String
  },
  {
    collection: "users"
  }
);
var model = mongoose.model("model", userSchema);

module.exports = {
  fetchData: function (callback) {
    model.find({}, function (err, result) {
      if (err) throw err;
      if (result) {
        console.log(result);
        return JSON.stringify(result);
      } else {
        return JSON.stringify({
          error: "Error"
        });
      }
    });
  }
};
