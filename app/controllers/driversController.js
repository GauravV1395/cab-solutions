const express = require('express');
const router = express.Router();
const { Driver } = require('../models/driver');
const { validateID } = require('../middlewares/utilitites');

// post a driver

router.post('/', (req,res) => {
    let body = req.body;
    let driver = new Driver(body);
    driver.save().then((driver) => {
        res.send({
            driver,
            notice: 'successfully created the driver'
        });
    }).catch((err) => {
        res.send(err);
    });
});

// to get all drivers

router.get('/', (req,res) => {
    Driver.find().populate('trips').then((driver) => {
        res.send(driver);
    }).catch((err) => {
        res.send(err);
    });
});

// get one employee

router.get('/:id', validateID, (req,res) => {
    let id = req.params.id;
    Driver.findById(id).then((driver) => {
        res.send(driver);
    }).catch((err) => {
        res.send(err);
    });
});

// update

router.put('/:id', validateID, (req,res) => {
    let id = req.params.id;
    let body = req.body; 
    Driver.findByIdAndUpdate({_id: id}, {$set: body}, {new: true, runValidators: true}).then((driver) => {
        res.send({
            driver,
            notice: 'successfully updated the driver.'
        });
    }).catch((err) => {
        res.send(err);
    });
})

//delete

router.delete('/:id', validateID, (req,res) => {
    let id = req.params.id;
    Driver.findByIdAndDelete(id).then((driver) => {
        res.send({
            driver,
            notice: 'successfully removed'
        });
    }).catch((err) => {
        res.send(err);
    });
})

// view driver lists

router.get('/:id/trips', validateID, (req,res) => {
    let id = req.params.id;
    Driver.findById(id).populate('trips').then((driver) => {
        res.send(driver.trips);
    }).catch((err) => {
        res.send(err);
    });
})


module.exports = {
    driversController: router
}