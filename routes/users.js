var express = require("express");
var router = express.Router();

var Model = require("../models/userModel");
/* GET users listing. */
router.get("/", function (req, res, next) {
  Model.find({}, function (err, result) {
    if (err) throw err;
    if (result) {
      console.log(result);
      res.json(result);
    } else {
      res.send(
        JSON.stringify({
          error: "Error"
        })
      );
    }
  });
});
router.post("/login", (req, res) => {
  var name = req.body.name;
  var email = req.body.username;
  var password = req.body.password;
  var newUser = new Model({
    email: email,
    password: password,
    full_name: name
  });
  newUser.save(function (err, user) {
    if (err) return console.error(err);
    console.log(user.full_name + " saved to bookstore collection.");
  });
});
module.exports = router;
