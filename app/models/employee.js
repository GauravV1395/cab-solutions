const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const employeeSchema = new Schema({
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
                return 'invalid email format';
            }
        }
    },

    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },

    mobile_number: {
        type: Number,
        required: true,
        unique: true,
        minlength: 10
    },

    shift: {
        type: String,
        required: true,
        enum: ['9:30-6:30', '13:30-22:30', '18:30-1:30','21:30-6:30']
    },

    blood_group: {
        type: String,
        required: true,
        enum: ['O+', 'O-', 'AB+', 'AB-', 'B+', 'B-', 'A+', 'A-']
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = {
    Employee
}