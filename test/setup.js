//https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
// Used to include headless DOM
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}
global.window = window;
global.document = window.document;
global.$ = require('jquery');
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);
module.exports = {jsdom: jsdom};
