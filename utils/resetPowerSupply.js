const Request = require('request')
const config = require('../config.js')
const url = config.BASE_URL
const port = config.BASE_PORT

module.exports = (cb) => {
  Request.post({
      url: `http://${url}:${port}/reset`
    }, (err, resp, body) => {
    if (err) { return cb(err); }
    
    let results = body;
    
    cb(null, results);
  });
}