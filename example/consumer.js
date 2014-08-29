var Client = require('../index.js');

var consumer = new Client();


consumer.on('error', function(err) {
    console.log(error);
});

consumer.on('receipt', function(message) {
    console.log(message);
});

consumer.send('topic', 'test', { "time": Date() }, function(err, message) {
    if (err) {
        console.log(err);
    } else {
        console.log(message);
    }
});

