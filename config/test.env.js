'use strict'
var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
/**
 * 测试环境配置
 * npm run build-test 时使用配置
 */
module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  CHAT_SERVER: '"http://127.0.0.1:8013"',
  MOCK: "false"
})