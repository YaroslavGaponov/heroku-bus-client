var Client = require('../../index.js');

var publisher = new Client('http://stormy-gorge-8934.herokuapp.com');

publisher.send('topic', 'test', { "time": Date(), 'message': process.argv[2] || 'Hello!!!' });
