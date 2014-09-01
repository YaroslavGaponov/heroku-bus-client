var Client = require('../index.js');

var consumer = new Client('http://stormy-gorge-8934.herokuapp.com');



consumer.on('error', function(err) {
    console.log(err);
});

consumer.on('receipt', function(message) {
    console.log(message);
});

consumer.on('connected', function(configure) {
    console.log(configure);
    consumer.send('topic', 'test', { "time": Date(), 'message': process.argv[2] || 'Hello!!!' }, function(err, message) {
        if (err) {
            console.log(err);
        } else {
            console.log(message);
        }
    });
});

consumer.connect();