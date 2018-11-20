const express = require('express');
const router = express.Router();
const { employeesController } = require('../app/controllers/employeesController');

router.use('/employees', employeesController);

module.exports = {
    routes: router
}

