const TrustSiteDic = {
  "http://localhost:3222": true,
  "http://yeze.eastasia.cloudapp.azure.com:3222": true,
  "http://yeze.eastasia.cloudapp.azure.com": true,
  "http://yeze.xyz": true
}

const COOKIE_KEY = 'uatoken'
const USER_KEY = 'user'

var userAccountMap = {
  'yeze322': { password: '1234' },
  'yuejzha': { password: '1234' },
  'test': {password: 'test'},
  'test1': {password: 'test1'}
}

var RedisConf = {
  EXP_TIME: 256256 // seconds, nealy 3 days
}

var machineHostMap = {
  'YEZE-PC': 'yeze.xyz',
  'yezeubuntu': 'localhost',
  'YEZEx1': 'yeze.xyz'
}

module.exports = {
  TrustSiteDic,
  COOKIE_KEY,
  USER_KEY,
  userAccountMap,
  RedisConf,
  machineHostMap
}