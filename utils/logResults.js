module.exports = (err, results) => {
  if (err) {
    return err.code === 'ENETUNREACH'
      ? console.error('Hardware API is unreachable!')
      : console.error(err) 
  }

  console.log(results)
}