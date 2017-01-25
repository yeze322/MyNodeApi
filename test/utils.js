function transformCookie (cookieList) {
  return cookieList.map(x => x.match(/[a-z]+=.*?;/)[0]).join('')
}

module.exports = {
  transformCookie
}