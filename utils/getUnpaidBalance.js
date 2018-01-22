module.exports = balanceInBaseUnits => {
  let baseDivider = Math.pow(10, 18)
  return (+balanceInBaseUnits / baseDivider).toFixed(3)
}