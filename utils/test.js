const getCurrentStats = require('./getCurrentStatsByMinerName')
const resetPowerSupply = require('./resetPowerSupply')
const logResults = require('./logResults')
const getLastReading = require('./getLastReading')

getCurrentStats('gill', logResults)
//getCurrentStats('gil', logResults)

getCurrentStats('mdt', logResults)
//getCurrentStats('m d t', logResults)
//getCurrentStats(undefined, logResults)

//resetPowerSupply(logResults)

getLastReading(logResults)