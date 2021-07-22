var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var Model = require("../models/userModel");
var jwt = require("jsonwebtoken");

var { verifyToken, verifyAdminToken } = require("../middlewares/auth");

/* GET users listing. */
router
  .get("/", verifyToken, function (req, res, next) {
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
  })

  .post("/login", async (req, res) => {
    try {
      var username = req.body.username;
      var password = req.body.password;
      if (!(username && password)) {
        res.status(400).send("All input is required");
      }
      // var encryptedPassword = await bcrypt.hash(password, 10);

      const User = await Model.findOne({ email: username });

      if (User && (await bcrypt.compare(password, User.password))) {
        const token = await jwt.sign(
          { user_id: User._id, username },
          "secret",
          {
            expiresIn: "2h"
          }
        );
        return res.status(200).json({
          full_name: User.full_name,
          email: User.email,
          id: User._id,
          token
        });
      } else {
        res.status(400).send("No username");
      }
    } catch {
      res.status(400).send("Login error");
    }
    console.log(username, password);
  });
router.get("/verifyAdmin", verifyAdminToken, (req, res) => {
  res.send("admin");
});
router.post("/Register", async (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  console.log(name, email, password);

  if (!(email && password && name)) {
    res.status(400).send("All input is required");
  }

  const oldUser = await Model.findOne({ email });

  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }
  var encryptedPassword = await bcrypt.hash(password, 10);

  var newUser = new Model({
    email: email,
    password: encryptedPassword,
    full_name: name
  });
  newUser.save(async function (err, user) {
    if (err) return console.error(err);
    const token = await jwt.sign({ user_id: user._id, email }, "secret", {
      expiresIn: "2h"
    });
    res.json({
      full_name: newUser.full_name,
      email: newUser.email,
      id: newUser._id,
      token
    });
    console.log(newUser);
  });
});

// router.get("/logout", (req, res) => {
//   const token = req.body.token;
//   console.log(token);
//   jwt.destroy(token);
//   res.status(200).json("logout");
// });
module.exports = router;
