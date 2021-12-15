const express = require('express'),
app = express(),
mongoose = require('mongoose'),
AppointmentService = require("./services/AppointmentService");

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
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("create");
});

app.post("/register", async (req, res) => {

  let status = await AppointmentService.Create(req.body);

  if(status){
    res.redirect("/");
  }else{
    res.json({err: "Error during the appointment create."});
  }
});


module.exports = app;