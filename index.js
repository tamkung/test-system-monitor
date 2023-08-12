var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');
var diskspace = require('diskspace');
var cpu = require('./cpu.js');
http.listen(3000, function () {
    console.log('listening on *:3000');
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (client) {
    console.log('Client connected..');
    client.on('join', function (data) {
        console.log(data);
    });
    setInterval(function () {
        var currentDate = new Date();
        io.sockets.emit('clock', { currentDate: currentDate });
        var freemem = os.freemem();
        var totalmem = os.totalmem();
        var percentageMem = 100 - ~~(100 * freemem / totalmem);
        io.sockets.emit('memory', { percentageMem: percentageMem });
        var startMeasure = cpu.cpuAverage();
        setTimeout(function () {
            var endMeasure = cpu.cpuAverage();
            var idleDifference = endMeasure.idle - startMeasure.idle;
            var totalDifference = endMeasure.total - startMeasure.total;
            var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
            io.sockets.emit('cpu', { percentageCPU: percentageCPU });
        }, 100);
        diskspace.check('/', function (err, result) {
            var usedDisk = result.used;
            var totalDisk = result.total;
            var percentageDisk = 100 - ~~(100 * usedDisk / totalDisk);
            io.sockets.emit('disk', { percentageDisk: percentageDisk });
        });
    }, 1000);
});