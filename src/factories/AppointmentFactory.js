class AppointmentFactory{

  Build(appointment){

    let day = appointment.date.getDate()+1;
    let month = appointment.date.getMonth();
    let year = appointment.date.getFullYear();
    let hour = Number.parseInt(appointment.time.split(":")[0]);
    let minutes = Number.parseInt(appointment.time.split(":")[1]);

    let startDate = new Date(year, month, day, hour, minutes, 0, 0);
    // startDate.setHours( startDate.getHours() - 3);
    

    let finalAppointment = {
      id: appointment._id,
      title: `${appointment.name}: ${appointment.description}`,
      start: startDate,
      end: startDate
    } 

    return finalAppointment;
  }
}

module.exports = new AppointmentFactory();