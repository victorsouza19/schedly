const schema = require("../models/appointment"), 
mongoose = require('mongoose'),
AppointmentFactory = require("../factories/AppointmentFactory");

const appointment = mongoose.model("Appointment", schema);

class AppointmentService{

  async Create(data){
    const {name, email, description, cpf, date, time} = data;


    // form validation
    if(name == undefined || name == '' || name == ' '){
      return false;
    }

    if(email == undefined || email == '' || email == ' '){
      return false;
    }

    if(description == undefined || description == '' || description == ' '){
      return false;
    }

    if(cpf == undefined || cpf == '' || cpf == ' '){
      return false;
    }

    if(date == undefined || date == '' || date == ' '){
      return false;
    }

    if(time == undefined || time == '' || time == ' '){
      return false;
    }
    

    let newAppointment = new appointment({
      name, 
      email, 
      description, 
      cpf, 
      date, 
      time,
      finished: false
    });

    try {
      await newAppointment.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    } 
  }

  async GetAll(showFinished){
    try {
      if(showFinished){
        let result = await appointment.find();
        let appointments = [];

        result.forEach(appointment => {
          if(appointment.date != undefined){
            appointments.push( AppointmentFactory.BuildDate(appointment) );
          }
        });

        return appointments;

      }else{
        let result = await appointment.find({'finished': false});
        let appointments = [];

        result.forEach(appointment => {
          if(appointment.date != undefined){
            appointments.push( AppointmentFactory.Build(appointment) );
          }
        });

        return appointments;
  
      }
    } catch (error) {
      console.log(error);
      return {err: "Error during the database communication"};
    }
    
  }

  async GetById(id){
    if(id != undefined){
      try {
          let result = await appointment.findOne({'_id': id});

          if(result != null){
            return {status: true, result};
          }else{
            return {status: false};
          }

      } catch (err) {
        console.log(err);
        return {status: false};

      }
    }
  }

  async Finish(id){
    try {
      await appointment.findByIdAndUpdate(id, {finished:  true});
      return true;
    } catch (err) {
      console.log(err);
      return false;
    } 
  }

  async Search(params){
    let query = [];

    if(params.cpf){
      query.push({cpf: params.search});
    }
    if(params.email){
      query.push({email: params.search});
    }
    if(params.name){
      query.push({name: params.search});
    }

    try {
      let result = await appointment.find().or(query);
      let appointments = [];

      result.forEach(appointment => {
        if(appointment.date != undefined){
          appointments.push( AppointmentFactory.BuildDate(appointment) );
        }
      });

      return appointments;

    } catch (error) {
      console.log(error);
      return []; 

    }
  }
};

module.exports = new AppointmentService();