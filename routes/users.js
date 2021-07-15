var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/about", (req, res) => {
  console.log("about rqurest");
  res.send("Hello");
});
module.exports = router;
