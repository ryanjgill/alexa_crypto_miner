module.exports = hashRate => {
  let rateInMhs = (hashRate/1000000).toFixed(1)
  
  return `${rateInMhs} Megahashes per second`
}
