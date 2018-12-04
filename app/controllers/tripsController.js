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

// update a trip.

router.put('/:id', validateID, (req, res) => {
    let tripid = req.params.id;
    let body = req.body;
    Trip.findById(tripid).then((trip) => {
        if (body.hasOwnProperty('employees')) {
            body.employees.forEach(function (n) {
                if (trip.employees.includes(n)) {
                    Employee.updateMany({ _id: { $in: trip.employees } }, { $pull: { trips: tripid } }).then((employees) => {
                        console.log(employees);
                    });
                    
               
                } else {
                    
                    Employee.updateMany({_id: {$in: employees}}, {$push: {trips: tripId}}).then((employees) => {
                        console.log(employees);
                    });
                }
            })
        } else if (body.hasOwnProperty('driver')){
            console.log(trip.driver, "driver");
            console.log(body.driver, "driver");
            if (trip.driver === body.driver) {
                      
                Driver.updateMany({_id: trip.driver}, {$pull: {trips: tripid}}).then((driver) => {  
                    console.log(driver);
                });
            } else {
                Driver.updateMany({_id: driver}, {$push: {trips: tripId}}).then((driver) => {
                    console.log(driver);
                }); 
            }
        }
        trip.set(body);
        trip.save();
        res.send(trip);
    })

})
// delete a trip

router.delete('/:id', validateID, (req, res) => {
    let tripid = req.params.id;
    Trip.findByIdAndRemove(tripid).then((trip) => {
        Employee.updateMany({ _id: { $in: trip.employees } }, { $pull: { trips: tripid } }).then((employees) => {
            console.log(employees);
        });     
        Driver.updateMany({_id: trip.driver}, {$pull: {trips: tripid}}).then((driver) => {  
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