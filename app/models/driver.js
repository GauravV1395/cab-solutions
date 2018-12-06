const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const driverSchema = new Schema ({
    name: {
        type: String, 
        required: true,
        minlength: 2,
        maxlength: 64
    },

    email: {
        type: String,
        required: true,
        unique: true,

        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: function () {
                return "invalid email format.";
            }
        }
    },

    mobile_number: {
        type: String,
        required: true,
        unique: true,
    },

    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },

    car_type: {
        type: String,
        required: true,
        enum: ['sedan', 'hatchback','electric','tt', 'shuttle']
    },

    reg_num: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 20
    },

    aadhar_number: {
        type: String,
        required: true,
        unique: true
    },

    driving_license: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 20
    },

    blood_group: {
        type: String,
        required: true,
        enum: ['O+', 'O-', 'AB+', 'AB-', 'B+', 'B-', 'A+', 'A-']
    },
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = {
    Driver
}