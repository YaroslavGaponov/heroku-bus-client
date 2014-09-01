
var Client = require('../../index.js');

var subscriber = new Client('http://stormy-gorge-8934.herokuapp.com');

subscriber.subscribe('topic', 'test', function(err, message) {
   console.log(message); 
});

subscriber.on('message', function(message) {
    console.log(message);
});

subscriber.on('error', function(error) {
    console.log(error);
});
