const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(5000);

const io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');
});

const apiai = require('apiai')('57bd500a3ebc824fd8f284ea2347d2751b91811a');

io.on('connection', function(socket) {
    socket.on('chat message', (text) => {

        // Get a reply from API.AI

        let apiaiReq = apiai.textRequest(text, {
            sessionId: 108841673844139301901
        });

        apiaiReq.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;
            socket.emit('bot reply', aiText);
        });

        apiaiReq.on('error', (error) => {
            console.log(error);
        });

        apiaiReq.end();

    });
});
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

