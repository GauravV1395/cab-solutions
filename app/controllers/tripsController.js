const express = require('express');
const router = express.Router();
const { Trip } = require('../models/trip');
const { validateID } = require('../middlewares/utilitites');
const { Employee } = require('../models/employee');
const { Driver } = require('../models/driver');
const twilio = require('twilio');
const accountSid = "ACd91ff63c40a32b0895dff4a1dfa172c8";
const authToken = "d5705e40d58587f060128f80bfa1b137";
const client = require('twilio')(accountSid, authToken);

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

router.get("/driver/:id", (req, res) => {
    let id = req.params.id;
    console.log(id);
    Trip.find({ driver: id }).then((trip) => {
        console.log(trip);
        res.send(trip);
    })
})


// delete/add employee from a trip as well as update a trip.


router.put('/:id', validateID, (req, res) => {
    let tripid = req.params.id;
    let body = req.body.employees;

    function removeFromEmployee(tripid, removedEmplyees, totoalEmployees) {
        Employee.update({ _id: { $in: removedEmplyees } }, { $pull: { trips: tripid } }).then((res) => {
            console.log(res);
        })

        Employee.update({ _id: { $in: totoalEmployees } }, { $addToSet: { trips: tripid } }).then((res) => {
            console.log(res);
        });
    }
    Trip.updateOne({ _id: tripid }, { employees: req.body.employees, driver: req.body.driver, shift: req.body.shift, route: req.body.route, pickup: req.body.pickup }).then((res) => {
        removeFromEmployee(tripid, req.body.removedEmployee, req.body.employees);
        console.log(res);
        req.body.employees.forEach(function (n) {
            Employee.findById(n).then((employee) => {
                Driver.findById(req.body.driver).then((driver) => {
                    client.messages
                        .create({
                            body: `Driver: ${driver.name}, Mobile number: ${driver.mobile_number}, pick_up: ${req.body.pick_up}, route: ${req.body.route}`,
                            from: "+1 859 697 0416",
                            to: employee.mobile_number
                        }).then(message => console.log(message.body)).done();
                    client.messages
                        .create({
                            body: `Employee: ${employee.name}, mobile Number: ${employee.mobile_number}, pick_up: ${req.body.pick_up}, route: ${req.body.route}`,
                            from: "+1 859 697 0416",
                            to: driver.mobile_number
                        }).then(message => console.log(message.sid)).done();
                })
                console.log(employee);
            });
        })
        console.log(req.body.removedEmployee);
        if (req.body.removedEmployee.length > 0) {
            req.body.removedEmployee.forEach((n) => {
                Employee.findById(n).then((employee) => {
                    client.messages
                        .create({
                            body: "your trip details have been changed. You will receive the details shortly.",
                            from: "+1 859 697 0416",
                            to: employee.mobile_number
                        }).then(message => console.log(message.sid)).done();
                })
            })
        }
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