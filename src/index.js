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

app.get("/calendar", (req, res) => {
  res.render("calendar");
});

app.get("/event/:id", async (req, res) => {
  let id = req.params.id;

  let event = await AppointmentService.GetById(id);

  if(event.status){
    res.render("event", {event: event.result});
  }else{
    res.redirect("/");
  }

});

app.post("/finish", async (req,res) => {
  const id = req.body.id;

  let result = await AppointmentService.Finish(id);
  if(result){
    res.redirect("/");
  }else{
    res.json({err: "Error during the appointment update."});
  }
  
});

app.get("/appointments", async (req, res) => {

  let result = await AppointmentService.GetAll(false);

  if(result.err){
    res.json(result);
  }else{
    res.json(result);
  }
  
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