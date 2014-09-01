
var http = require('http');
var util = require('util');
var url = require('url');
var EE = require('events').EventEmitter;

HTTP = {
    'GET': 'GET',
    'POST': 'POST'
}


var Request = function(baseUrl) {
    if (this instanceof Request) {
        this.method = null;
        this.url = null;        
        this.body = null;
        this.timeout = null;
    } else {
        return new Request();
    }
}

Request.prototype.setMethod = function(method) {
    this.method = method;
    return this;
}

Request.prototype.setUrl = function(baseUrl, path) {
    this.url = url.resolve(baseUrl, path);
    return this;
}

Request.prototype.setBody = function(body) {
    this.body = body;
    return this;
}

Request.prototype.setTimeout  = function(timeout) {
    this.timeout = timeout;
    return this;
}

Request.prototype.done = function(cb) {    
    var options = url.parse(this.url);
    options.method = this.method;
    options.headers = { 'Content-Type': 'application/json' };    
    var req = http.request(options, function(res) {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk.toString();
        });
        res.once('end', function() {
            return cb(res.statusCode, data);
        });
        res.once('error', function(err) {
            return cb(res.statusCode, err);
        });
    });
    req.setTimeout(this.timeout);
    req.setSocketKeepAlive(true);
    if (this.body) {
        req.write(typeof this.body === 'object' ? JSON.stringify(this.body) : this.body);
    }
    req.end();
}


var TransportError = function (code, message, details) {
    if (this instanceof TransportError) {
        this.code = code;
        this.message = message;
        this.details = details;
        Error.captureStackTrace(this, TransportError);
    } else {
        return new TransportError(message);
    }
}

util.inherits(TransportError, Error);

TransportError.prototype.toString = function() {    
    return util.format('code: %s, message: %s, details: %s', this.code, this.message, this.details);
}


var Client = module.exports = function(baseUrl) {
    EE.call(this);
    this.baseUrl = baseUrl || 'http://localhost:5000';
}

util.inherits(Client, EE);

Client.prototype.connect = function() {
    this.emit('connected');
}

Client.prototype.send = function(type, name, message, callback) {
    var self = this;
    
    var _send = function(callback) {
        Request().setUrl(self.baseUrl, util.format('/%s/%s', type, name)).setMethod(HTTP.POST).setBody(message).done(callback);
    }
    
    var _done = function(statusCode, data) {
        switch (http.STATUS_CODES[statusCode]) {
            case 'OK':
                self.emit('receipt', message);
                if (callback && typeof callback === 'function') {
                    callback(null, message);
                }            
                break;
            default:
                var error = new TransportError(statusCode, http.STATUS_CODES[statusCode], data);
                self.emit('error', error);
                if (callback && typeof callback === 'function') {
                    callback(error, null);
                }                            
                break;
        }
    }
    
    _send(_done);
}


Client.prototype.subscribe = function(type, name, callback) {
    var self = this;
    
    var _subscribe = function(callback) {
        Request().setTimeout(25000).setUrl(self.baseUrl, util.format('/%s/%s', type, name)).setMethod(HTTP.GET).done(callback);
    }
    
    var _done = function(statusCode, data) {        
        switch (http.STATUS_CODES[statusCode]) {
            case 'OK':
                self.emit('message', data);
                if (callback && typeof callback === 'function') {
                    callback(null, data);
                }
            case 'Request Time-out':
            case 'Service Unavailable':
                _subscribe(_done);
                break;
            default:
                var error = new TransportError(statusCode, http.STATUS_CODES[statusCode], data);
                self.emit('error', error);
                if (callback && typeof callback === 'function') {
                    callback(error, null);
                }                            
                break;            
        }
        
    }
    
    _subscribe(_done);    
}



Client.prototype.disconnect = function() {
    this.emit('disconnectd');
}