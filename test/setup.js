// https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
// Used to include headless DOM
const { JSDOM } = require('jsdom')
const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom
function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  })
}
global.window = window
global.document = window.document
global.$ = require('jquery')
global.navigator = {
  userAgent: 'node.js'
}
global.isInTestEnv = true
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0)
}
global.cancelAnimationFrame = function (id) {
  clearTimeout(id)
}
copyProps(window, global)
module.exports = { jsdom: jsdom }
