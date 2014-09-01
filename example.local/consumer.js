var Client = require('../index.js');

var consumer = new Client('http://localhost');


consumer.on('error', function(err) {
    console.log(error);
});

consumer.on('receipt', function(message) {
    console.log(message);
});

consumer.send('topic', 'test', { "time": Date(), 'message': process.argv[2] || 'Hello!!!' }, function(err, message) {
    if (err) {
        console.log(err);
    } else {
        console.log(message);
    }
});

