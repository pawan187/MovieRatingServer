var express = require("express");
var router = express.Router();

var { verifyAdminToken, verifyToken } = require("../middlewares/auth");

var mongoose = require("mongoose");

var db = require("../routes/database");

var userModel = require("../models/userModel");

var CommentSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "movies" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    username: String,
    rating: Number,
    comment: String
  },
  {
    collection: "Reviews"
  }
);
var CommentModel = mongoose.model("CommentModel", CommentSchema);

var MovieSchema = new mongoose.Schema(
  {
    name: String,
    description: String
  },
  {
    collection: "movies"
  }
);

var Model = mongoose.model("MovieModel", MovieSchema);
/* GET home page. */
router
  .get("/movies", async function (req, res, next) {
    try {
      console.log("Movies route");
      Model.find({}, (err, data) => {
        res.json(data);
      });
    } catch {
      res.status(401).send("Error in data retrieval");
    }
  })
  .get("/movie/:id", (req, res) => {
    try {
      var id = req.params.id;
      Model.find({ _id: id }, (err, data) => {
        CommentModel.find({ movieId: id }, (err, comments) => {
          data = { ...data, comments };
          console.log(data);
          res.send(data);
        });
      });
    } catch {
      res.status(401).send("Error in data retrieval");
    }
  })
  .post("/movie", verifyAdminToken, (req, res) => {
    try {
      var name = req.body.name;
      var description = req.body.description;
      var newMovie = new Model({ name: name, description: description });
      newMovie.save((err, data) => {
        res.send(data.name + " is added");
      });
      console.log("added" + newMovie);
    } catch {
      res.status(401).send("Error in data storing");
    }
  })
  .post("/comment", verifyToken, (req, res) => {
    try {
      var movieId = req.body.movieId;
      var userId = req.body.userId;
      var comment = req.body.comment;
      var rating = req.body.rating;
      var username = req.body.username;
      var newComment = new CommentModel({
        movieId,
        userId,
        comment,
        rating,
        username
      });
      newComment.save((err, data) => {
        res.send("added" + data);
      });
    } catch {
      res.status(401).send("Error in comment storing");
    }
  });
module.exports = router;
