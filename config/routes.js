const express = require('express');
const router = express.Router();
const { employeesController } = require('../app/controllers/employeesController');
const { driversController} = require('../app/controllers/driversController');

router.use('/employees', employeesController);

router.use('/drivers', driversController);

module.exports = {
    routes: router
}

