const express = require('express');
const router = express.Router();
const { Employee } = require('../models/employee');
const { validateID } = require('../middlewares/utilitites');

// post an employee

router.post('/', (req,res) => {
    let body = req.body;
    let employee = new Employee(body);
    employee.save().then((employee) => {
        res.send({
            employee,
            notice: 'successfully created the user.'
        });
    }).catch((err) => {
        res.send(err);
    });
})

// get all employees

router.get('/', (req,res) => {
    Employee.find().populate('trips').then((employee) => {
        res.send(employee);
    }).catch((err) => {
        res.send(err);
    });
});

// get one employee

router.get('/:id', validateID, (req,res) => {
    let id = req.params.id;
    Employee.findById(id).then((employee) => {
        res.send(employee);
    }).catch((err) => {
        res.send(err);
    });
});

// update employee

router.put('/:id', validateID, (req,res) => {
    let id = req.params.id;
    let body = req.body;

    Employee.findByIdAndUpdate({_id: id}, { $set: body }, {new: true, runValidators: true }).then((employee) => {
        res.send({
            employee,
            notice: 'successfully updated'
        });
    }).catch((err) => {
        res.send(err);
    });
})

// delete employee

router.delete('/:id', validateID, (req,res) => {
    let id = req.params.id;
    Employee.findByIdAndRemove(id).then((employee) => {
        res.send({
            employee,
            notice: 'successfully removed'
        });
    }).catch((err) => {
        res.send(err);
    });
})

// view trips

router.get('/:id/trips', validateID, (req,res) => {
    let id = req.params.id;
    Employee.findById(id).populate('trips').then((employee) => {
        res.send(employee.trips);
    }).catch((err) => {
        res.send(err);
    })
})

// sort employees by using its shift.

router.get('/shifts/:shift', (req,res) => {
    let Incomingshift = req.params.shift;
    console.log(typeof req.params.shift);
    Employee.find({shift: Incomingshift}).then((employees) => {
        res.send(employees);
    }).catch((err) => {
        res.send(err);
    })
})

// sort employees by using routes.

router.get('/route/:route', (req, res) => {
    let Incomingroute = req.params.route;
    Employee.find({route: Incomingroute}).then((employees) => {
        res.send(employees);
    }).catch((err) => {
        res.send(err);
    })
})

module.exports = {
    employeesController: router
}

