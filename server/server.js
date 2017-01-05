var express = require("express");
var mongoose = require("mongoose");
var bodyParser= require("body-parser");
var path = require("path");

// controllers:
var schoolController = require("./controllers/schoolController");

//Express request pipelin
var app = express();
app.use(express.static(path.join(__dirname, "../app/dist")));
app.use(bodyParser.json());
app.use("/api", schoolController);

app.listen(7777, function(){
  console.log("It's listening on port", 7777);
})

//connect to MongoDB Database 
// *** note the database name is different from tutorial***
mongoose.connect("mongodb://localhost/schoolselector");
