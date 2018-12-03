const express = require('express');
const router = express.Router();
const { Trip } = require('../models/trip');
const { validateID } = require('../middlewares/utilitites');
const { Employee } = require('../models/employee');
const { Driver } = require('../models/driver');

// post trip

router.post('/', (req,res) => {
    let body = req.body;
    let trip = new Trip(body);
    trip.save().then((trip) => {
        res.send({
            trip,
            notice: 'successfully created the trip.'
        });
    }).catch((err) => {
        res.send(err);
    });
});

// get all trips.

router.get('/', (req,res) => {
    Trip.find().populate('employees').populate('driver').then((trips) => {
        res.send(trips);
    }).catch((err) => {
        res.send(err);
    });
})

// get one trip.

router.get('/:id', (req,res) => {
    let id = req.params.id;
    Trip.findById(id).populate('employees').populate('driver').then((trip) => {
        res.send(trip);
    }).catch((err) => {
        res.send(err);
    })
})

// update a trip.

router.put('/:id', validateID, (req,res) => {
    let tripid = req.params.id;
    let body = req.body;
    let employees = req.body.employees;
    console.log(employees, "employees");
    //let driver = this.driver;
    Trip.findByIdAndUpdate({ _id: tripid }, { $set: body }, {new: true, runValidators: true}).then((trip) => {
        res.send({
            trip,
            notice: 'successfully updated.'
        });
    }).catch((err) => {
        res.send(err);
    });
})

// delete a trip

router.delete('/:id', validateID, (req,res) => {
    let id = req.params.id;
    Trip.findByIdAndRemove(id).then((trip) => {
        res.send({
            trip,
            notice: 'successfully removed'
        });
    }).catch((err) => {
        res.send(err);
    });
})

module.exports = {
    tripsController: router
}