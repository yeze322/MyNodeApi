function extractCookieString (response) {
  var cookieList = response.header['set-cookie']
  return cookieList.map(x => x.match(/[a-z]+=.*?;/)[0]).join('')
}

module.exports = {
  extractCookieString
}