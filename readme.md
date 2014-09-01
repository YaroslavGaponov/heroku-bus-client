Heroku bus client
========

Node.JS client for Heroku Bus server (https://github.com/YaroslavGaponov/heroku-bus-server)


Example
========

Publisher
-------

```javascript
var Client = require('../index.js');

var publisher = new Client('http://stormy-gorge-8934.herokuapp.com');

publisher.send('topic', 'test', { "time": Date(), 'message': process.argv[2] || 'Hello from Ukraine!!!' });

```

Subscriber
----------
```javascript

var Client = require('../index.js');

var subscriber = new Client('http://stormy-gorge-8934.herokuapp.com');

subscriber.subscribe('topic', 'test');

subscriber.on('message', function(message) {
    console.log(message);
});

subscriber.on('error', function(error) {
    console.log(error);
});
```