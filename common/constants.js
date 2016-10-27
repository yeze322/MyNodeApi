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

var RedisConf = {
  EXP_TIME: 256256 // seconds, nealy 3 days
}
module.exports = {
  TrustSiteDic,
  COOKIE_KEY,
  userAccountMap,
  RedisConf
}