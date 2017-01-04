var express = require("express");
var path = require("path");

var app = express();
app.use(express.static(path.join(_dirname, "../app/dist")));
app.listen(7777, function(){
  console.log("It's listening on port", 7777);
})