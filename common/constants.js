var globalState = {
  'name' : 'yeze322',
  'repo' : 'MyNodeApi',
  'pswd' : '123456'
}

const TrustSiteDic = {
  "http://localhost:3222": true,
  "http://yeze.eastasia.cloudapp.azure.com:3222": true,
  "http://yeze.eastasia.cloudapp.azure.com": true,
  "http://yeze.xyz": true
}

const COOKIE_KEY = 'uatoken'

var userAccountMap = {
  'yeze322': { password: '1234' },
  'yuejzha': { password: '1234' }
}

module.exports = {
  globalState,
  TrustSiteDic,
  COOKIE_KEY,
  userAccountMap
}