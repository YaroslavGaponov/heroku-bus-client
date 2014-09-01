Heroku bus client
========

Node.JS client for Heroku Bus server (https://github.com/YaroslavGaponov/heroku-bus-server)


Example
========

Consumer
-------

```javascript
var Client = require('../index.js');

var consumer = new Client('http://stormy-gorge-8934.herokuapp.com');


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

```

Subscriber
----------
```javascript

var Client = require('../index.js');

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
```