var Client = require('../../index.js');

var publisher = new Client('http://stormy-gorge-8934.herokuapp.com');



publisher.on('error', function(err) {
    console.log(err);
});

publisher.on('receipt', function(message) {
    console.log(message);
});

publisher.on('connected', function(configure) {
    console.log(configure);
    publisher.send('topic', 'test', { "time": Date(), 'message': process.argv[2] || 'Hello!!!' }, function(err, message) {
        if (err) {
            console.log(err);
        } else {
            console.log(message);
        }
    });
});

publisher.connect();