const schema = require("../models/appointment"), 
mongoose = require('mongoose'),
mailer = require('nodemailer'),
AppointmentFactory = require("../factories/AppointmentFactory");

require('dotenv').config();

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
      finished: false,
      notified: false
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

  async SendNotification(){
    let appointments = await this.GetAll(false);

    let transporter = mailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
    
    appointments.forEach(async item => {
      let date = item.start.getTime();
      let hour = 1000 * 60 * 60;
      let gap = date - Date.now();

      if(gap <= hour){
        if(!item.notified){

          await appointment.findByIdAndUpdate(item.id, {notified: true});

          transporter.sendMail({
            from: "Schedly <remember@schedly.com>",
            to: item.email,
            subject: `Reminder | ${item.title}`,
            text: `Hello, don't forget your event today: ${item.start}`,
            html: `
            <h2>Hello!</h2>
            <h4>Don't forget your event today:</h4>
            <p><strong>${item.title}</strong> | ${item.start}</p>
            <small>If you are unable to attend, please contact us soon as possible. (:</small>
            `
          }).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);

          });
        }
      }
    });
  }
};

module.exports = new AppointmentService();