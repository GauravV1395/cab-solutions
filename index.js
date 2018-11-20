const express = require('express');
const app = express();
const { mongoose } = require('./config/db');
const { routes } = require('./config/routes');
const port = 3000;

app.use(express.json());

app.use('/', routes);

app.listen(port, () => {
    console.log('listening to port', port);
});

