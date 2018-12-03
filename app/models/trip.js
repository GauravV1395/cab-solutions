const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const { Employee } = require('../models/employee');
const { Driver } = require('../models/driver');

const tripSchema = new Schema ({
    employees: [{
        type: Schema.Types.ObjectId,
        ref:  'Employee'
    }],

    driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver'
    },

    date: {
        type: Date,
        default: Date.now
    },

    shift: {
        type: String,
        required: true,
        enum: ['9:30-18:30', '13:30-22:30', '18:30-1:30','21:30-6:30']
    },

    route: {
        type: String,
        required: true,
    },

    pick_up: {
        type: String,
        required: true,
        enum: ['18:45', '22:45', '1:45', '6:45']
    }
})

tripSchema.post('save', function(next) {
    let employees = this.employees;
    console.log(employees);
    let tripId = this._id;
    let driver = this.driver;
    console.log(tripId);
    Employee.updateMany({_id: {$in: employees}}, {$push: {trips: tripId}}).then((employees) => {
        Driver.updateMany({_id: driver}, {$push: {trips: tripId}}).then((driver) => {
            console.log(driver);
        });
        console.log(employees);
    });
})

const Trip = mongoose.model('Trip', tripSchema);

module.exports = {
    Trip
}