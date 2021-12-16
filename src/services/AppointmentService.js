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
        return await appointment.find();

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

};

module.exports = new AppointmentService();