const express = require('express'),
app = express(),
mongoose = require('mongoose');

// static files
app.use(express.static("public"));

// parser config
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// database
mongoose.connect("mongodb://localhost:27017/schedly");

// routes 
app.get("/", (req, res) => {
  res.json({msg: 'Hello'});
});

app.get("/register", (req, res) => {
  res.render("create");
});


module.exports = app;