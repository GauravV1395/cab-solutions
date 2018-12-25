const express = require('express');
const app = express();
const { mongoose } = require('./config/db');
const { routes } = require('./config/routes');
const cors = require('cors');
 socket = require('socket.io');
const port = 3001;

app.use(express.json());

app.use(cors());

app.use('/', routes);

app.listen(port, () => {
    console.log('listening to port', port);
});

server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    })
});
