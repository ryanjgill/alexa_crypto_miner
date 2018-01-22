const Request = require('request')
const config = require('../config.js')
const minerAddresses = config.minerAddresses

module.exports = (name = 'gill', cb) => {
  name = name === 'gil' ? 'gill' : name
  let minerAddress = minerAddresses[name.split(' ').join('').toLowerCase()]
  let url = `https://api.ethermine.org/miner/${minerAddress}/currentStats`

  Request(url, 'get', (err, resp, body) => {
    if (err) { return cb(err); }

    let results = JSON.parse(body);
    
    cb(null, results);
  });
}