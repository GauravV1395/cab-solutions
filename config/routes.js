const express = require('express');
const router = express.Router();
const { employeesController } = require('../app/controllers/employeesController');
const { driversController} = require('../app/controllers/driversController');
const { tripsController } = require('../app/controllers/tripsController');

router.use('/employees', employeesController);

router.use('/drivers', driversController);

router.use('/trips', tripsController);

module.exports = {
    routes: router
}

