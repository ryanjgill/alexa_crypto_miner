const getCurrentStats = require('./utils/getCurrentStatsByMinerName')
const resetPowerSupply = require('./utils/resetPowerSupply')
const getHashRateInMhs = require('./utils/getHashRateInMhs')
const getUnPaidBalance = require('./utils/getUnpaidBalance')
const getLastReading = require('./utils/getLastReading')

module.exports = {
	'LaunchRequest': function () {
		this.emit('WelcomeMessage')
  },
  'GetCurrentStats': function () {
    // gets the current hashrate of the miner by name --> addressId
    let minerName = this.event.request &&
    this.event.request.intent &&
    this.event.request.intent.slots &&
    this.event.request.intent.slots.Miner &&
    this.event.request.intent.slots.Miner.hasOwnProperty('value')
      ? this.event.request.intent.slots.Miner.value
      : ''

    if (!minerName || minerName === '') {
      this.emit(':tell', `Sorry I didn't get the name of that miner.`)
      return
    }

    getCurrentStats(minerName, (err, results) => {
      // if api error, respond with message saying its down
      if (err) {
        console.log(err)
        this.emit('APIDownMessage')
        return
      }

      // format results 
      let currentHashrate = getHashRateInMhs(results.data.currentHashrate)
      let avgHashrate = getHashRateInMhs(results.data.averageHashrate)
      let unpaidBalance = getUnPaidBalance(results.data.unpaid)
      let hasRateSentence = `The current hash rate is ${currentHashrate}.`
      let balanceSentence = `Your unpaid balance is ${unpaidBalance} Ethereum.`
      let response = [hasRateSentence, balanceSentence].join(' ')

      this.emit(':tell', response)
    })
  },
  'GetReport': function () {
    this.emit(':tell', 'Reports comming soon. Please try back in a bit.')
  },
	'GetTemperature': function () {
    let hardwareType = this.event.request &&
      this.event.request.intent &&
      this.event.request.intent.slots &&
      this.event.request.intent.slots.Hardware &&
      this.event.request.intent.slots.Hardware.hasOwnProperty('value')
      ? this.event.request.intent.slots.Hardware.value
      : ''

    if (!hardwareType || hardwareType === '') {
      this.emit('AMAZON.HelpIntent')
      return
    }

    // validHardwareTypes
    let validHardwareTypes = ['case', 'enclosure', 'room', 'radiator', 'gpu', 'gpus', 'video cards', 'video card', 'graphics cards', 'graphics card']

    if (validHardwareTypes.indexOf(hardwareType) < 0) {
      this.emit('AMAZON.HelpIntent')
      return
    }

    console.log('getLastReading for: ', hardwareType)

    getLastReading((err, results) => {
      // if api error, respond with message saying its down
      if (err) {
        console.log(err)
        let speechOutput = `The crypto miner monitor <say-as interpret-as="spell-out">api</say-as> is down at this time. Please try again later.`
        this.emit('APIDownMessage')
        return
      }

      console.log('results: ', results)

      // case temp
      let caseNames = ['case', 'enclosure']
      if (caseNames.indexOf(hardwareType) > -1) {
        let temp = (+(results.case_temp)).toFixed(0)
        let statement = `The case's temperature is ${temp} degrees celsius.`
        this.emit(':tell', statement)
        return
      }

      // radiator temp
      else if (hardwareType === 'radiator') {
        let temp = (+(results.radiator_temp)).toFixed(0)
        let statement = `The radiator's temperature is ${temp} degrees celsius.`
        this.emit(':tell', statement)
        return
      }

      // room temp
      else if (hardwareType === 'room') {
        let temp = (+(results.room_temp)).toFixed(0)
        let statement = `The room's temperature is ${temp} degrees celsius.`
        this.emit(':tell', statement)
        return
      }

      // default to GPUs
      else {
        let gpu1Temp = (+(results.gpu_1_temp)).toFixed(0)
        let gpu2Temp = (+(results.gpu_2_temp)).toFixed(0)
        let statement = `The temperatures on the graphics cards are as follows: 
          <say-as interpret-as="spell-out">GPU</say-as> 1 is at ${gpu1Temp} degrees celsius,
          <say-as interpret-as="spell-out">GPU</say-as> 2 is at ${gpu2Temp} degrees celsius.`
        this.emit(':tell', statement)
        return
      }
    })
  },
  'ResetPower': function () {
    resetPowerSupply((err, result)  => {
      this.emit(':tell', "Ok, I'm restarting the miners power supply. This should only take a few seconds.")
    })
  },
	'AMAZON.HelpIntent': function () {
    let reprompt = 'What would you like?'
		let speechOutput = `You can ask for hashrate by miner name, ask for case temperature, ask for graphics card temperatures, or reset power.`
		this.emit(':ask', speechOutput, reprompt)
	},
	'AMAZON.CancelIntent': function () {
		this.emit(':tell', 'Goodbye!')
	},
	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Goodbye!')
	},
  'WelcomeMessage': function () {
    let reprompt = 'What would you like?'
    let speechOutput = `I'm Crypto Miner, I can provide temperatures on your mining rig's case and GPUs as well as restart the 
    power supply. ${reprompt}`
    this.emit(':ask', speechOutput, reprompt)
  }, 
  'APIDownMessage': function () {
    let speechOutput = `The crypto miner monitor <say-as interpret-as="spell-out">api</say-as> is down at this time. Please try again later.`
    this.emit(':tellWithCard', speechOutput, 'Crypto miner monitor API is down', 'API is down. Please try again later.')
  },
  'Unhandled': function () {
    this.emit('AMAZON.HelpIntent')
  }
}