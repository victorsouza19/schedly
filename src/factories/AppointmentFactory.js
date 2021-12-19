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
      email: appointment.email,
      start: startDate,
      end: startDate,
      notified: appointment.notified
    } 

    return finalAppointment;
  }

  BuildDate(appointment){

    let day = appointment.date.getDate()+1;
    let month = appointment.date.getMonth();
    let year = appointment.date.getFullYear();
    let hour = Number.parseInt(appointment.time.split(":")[0]);
    let minutes = Number.parseInt(appointment.time.split(":")[1]);

    let startDate = `${day}/${month}/${year} ${hour}:${minutes}`;
    

    let finalAppointment = {
      id: appointment._id,
      name: appointment.name,
      email: appointment.email,
      description: appointment.description,
      cpf: appointment.cpf,
      date: startDate,
      finished: appointment.finished
    } 

    return finalAppointment;
  }
}

module.exports = new AppointmentFactory();