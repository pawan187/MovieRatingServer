// jsonwebtoken dotenv bcryptjs
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    console.log(req.user);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const verifyAdminToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    if (req.user.username !== "lalit123@gmail.com") {
      return res.status(401).send("Invalid User!");
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = { verifyToken, verifyAdminToken };
