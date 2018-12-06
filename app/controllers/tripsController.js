const express = require('express');
const router = express.Router();
const { Trip } = require('../models/trip');
const { validateID } = require('../middlewares/utilitites');
const { Employee } = require('../models/employee');
const { Driver } = require('../models/driver');

// post trip

router.post('/', (req, res) => {
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

router.get('/', (req, res) => {
    Trip.find().populate('employees').populate('driver').then((trips) => {
        res.send(trips);
    }).catch((err) => {
        res.send(err);
    });
})

// get one trip.

router.get('/:id', (req, res) => {
    let id = req.params.id;
    Trip.findById(id).populate('employees').populate('driver').then((trip) => {
        res.send(trip);
    }).catch((err) => {
        res.send(err);
    })
})

// get all the trips of a particular driver.

router.get("/driver/:id", (req,res) => {
    let id = req.params.id;
    console.log(id);
    Trip.find({driver: id}).then((trip) => {
        console.log(trip);
        res.send(trip);
    })
})

// delete/add employee from a trip as well as update a trip.


router.put('/:id', validateID, (req, res) => {
    let tripid = req.params.id;
    let body = req.body.employees;

    function removeFromEmployee(tripid,removedEmplyees,totoalEmployees){
        Employee.update({_id: {$in:removedEmplyees} }, {$pull: {trips: tripid}}).then((res) => {
            console.log(res);
        })
    
        Employee.update({_id:{$in:totoalEmployees}},{$addToSet:{trips:tripid}}).then((res)=>{
            console.log(res);
        });
    }
    Trip.updateOne({_id: tripid}, {employees: req.body.employees,driver: req.body.driver,shift: req.body.shift,route: req.body.route,pickup: req.body.pickup}).then((res) => {
        removeFromEmployee(tripid,req.body.removedemployee,req.body.employees);
        console.log(res);
    })
});



// delete a trip

router.delete('/:id', validateID, (req, res) => {
    let tripid = req.params.id;
    Trip.findByIdAndRemove(tripid).then((trip) => {
        Employee.updateMany({ _id: { $in: trip.employees } }, { $pull: { trips: tripid } }).then((employees) => {
            console.log(employees);
        });
        Driver.updateMany({ _id: trip.driver }, { $pull: { trips: tripid } }).then((driver) => {
            console.log(driver);
        });
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