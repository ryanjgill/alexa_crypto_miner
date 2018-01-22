const Request = require('request')
const config = require('../config.js')
const url = config.BASE_URL
const port = config.BASE_PORT

module.exports = (cb) => {
  Request(`http://${url}:${port}/lastReading`, 'get', (err, resp, body) => {
    if (err) { return cb(err); }

    let results = JSON.parse(body);
    
    cb(null, results);
  });
}