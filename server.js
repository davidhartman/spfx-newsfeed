// Port will be assigned automatically by the Azure Web App (process.env.port). For localhost debugging, we use 8080.
// You can use the built-in VS Code debugger to test the solution locally.
var port = process.env.port || 8080;
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var azure = require('azure');

server.listen(port);

app.get('/', function (req, res) {
    console.log("going to load index.html");
    res.sendFile(__dirname + '/index.html');
});

//var serviceBusService = azure.createServiceBusService(process.env.AZURE_SERVICEBUS_ACCESS_KEY);
var serviceBusService = azure.createServiceBusService('Endpoint=sb://newfeedsb.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=HBHGW2BU/NBu2mMxna0ifRisxqsbKpati+TD0jY83E4=');

setInterval(function () {
    serviceBusService.receiveQueueMessage('news_feed', function (error, message) {
        if (!error) {
            // Message received and deleted (default behavior of the service bus)
            console.log(message);

            // Broadcast to all connected clients
            io.emit('item:added', message);
        }
        else{
            console.log(error);
        }
    });
}, 1000);
