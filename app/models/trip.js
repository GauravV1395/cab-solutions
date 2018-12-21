const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Employee } = require('../models/employee');
const { Driver } = require('../models/driver');
//const twilio = require('twilio');
const accountSid = "ACd91ff63c40a32b0895dff4a1dfa172c8";
const authToken = "d5705e40d58587f060128f80bfa1b137";
const client = require('twilio')(accountSid, authToken);

const tripSchema = new Schema({
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }],

    driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    shift: {
        type: String,
        required: true,
        enum: ['9:30-18:30', '13:30-22:30', '18:30-1:30', '21:30-6:30']
    },

    route: {
        type: String,
        required: true,
        enum: ['Route1', 'Route2', 'Route3', 'Route4', 'Route5']
    },

    pick_up: {
        type: String,
        required: true,
        enum: ['18:45', '22:45', '1:45', '6:45']
    }
})

tripSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    this.wasModfied = this.wasModfied;
    next();
})

tripSchema.post('save', function (next) {
    let { driver, pick_up, route, date } = this;
    let { employees } = this;
    let tripId = this._id;
    if (this.wasNew || this.wasModified) {
        Employee.updateMany({ _id: { $in: employees } }, { $push: { trips: tripId } }).then((employees) => {
            console.log(employees);
        });
    }
    console.log(this.employees);
    this.employees.forEach(function (n) {
        Employee.findById(n).then((employee) => {
            Driver.findById(driver).then((driver) => {
                client.messages
                .create({
                    body: `Driver: ${driver.name}, Mobile number: ${driver.mobile_number}, pick_up: ${pick_up}, route: ${route}, date: ${date}`,
                    from: "+1 859 697 0416",
                    to: employee.mobile_number
                }).then(message => console.log(message.body)).done();
                client.messages
                .create({
                    body: `Employee: ${employee.name}, mobile Number: ${employee.mobile_number}, pick_up: ${pick_up}, route: ${route}, date: ${date}`,
                    from: "+1 859 697 0416",
                    to: driver.mobile_number
                }).then(message => console.log(message.sid)).done();
            })
            console.log(employee);
            
        });
    })
})


const Trip = mongoose.model('Trip', tripSchema);

module.exports = {
    Trip
}