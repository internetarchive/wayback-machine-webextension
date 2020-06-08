const dom = require('./setup').jsdom
const expect = require('chai').expect
const assert = require('assert').strict
const getUrlByParameter = require('../scripts/utils').getUrlByParameter
const isValidUrl = require('../scripts/utils').isValidUrl
const isNotExcludedUrl = require('../scripts/utils').isNotExcludedUrl
const badgeCountText = require('../scripts/utils').badgeCountText
const timestampToDate = require('../scripts/utils').timestampToDate

describe('twitter', () => {
  it('should extract correct tweet url', () => {
    dom.reconfigure({ url: 'chrome-extension://hkahpanhaccgppbidkekeijffcdppdan/twitter.html?url=https://archive.org/' })
    let tweetURL = getUrlByParameter('url')
    expect(tweetURL).to.be.equal('https://archive.org/')
  })
})

describe('isValidUrl', () => {
  var test_cases = [
    { 'url': 'chrome://extensions/', 'result': false },
    { 'url': 'https://example.com', 'result': true },
    { 'url': 'https://\xc3\xb1', 'result': true },
    { 'url': 'http://\xc3\x28', 'result': true },
    { 'url': '\xc3\xb1', 'result': false },
    { 'url': '\xc3\x28', 'result': false },
    { 'url': 'about:debugging', 'result': false },
    { 'url': 'about:home', 'result':false},
    { 'url': '192.168.1.251', 'result':false}
  ]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(isValidUrl(url)).to.equal(result)
    })
  })
  it('should reject non-strings', () => {
    let result = isValidUrl(5) || isValidUrl({}) || isValidUrl(true)
    expect(result).to.be.false
  })
})

describe('isNotExcludedUrl', () => {
  var test_cases = [
    { 'url': 'https://0.0.0.0', 'result': false },
    { 'url': 'https://localhost', 'result': false },
    { 'url': 'https://127.0.0.1', 'result': false },
    { 'url': 'chrome-extension://efppkbphbfgoiaadblijkcdkdmajikhd/singleWindow.html?url=https://www.google.com/', 'result': false },
    { 'url': 'https://chrome.google.com/webstore/category/extensions', 'result': false },
    { 'url': 'chrome://extensions', 'result': false },
    { 'url': 'chrome://newtab', 'result': false },
    { 'url': 'https://example.com', 'result': true },
    { 'url': '\xc3\xb1', 'result': true },
    { 'url': '\xc3\x28', 'result': true },
    { 'url': 'about:newtab', 'result': false },
    { 'url': 'about:home', 'result': false },
    { 'url': 'about:preferences', 'result': false },
    { 'url': 'about:debugging', 'result': false },
    { 'url': '192.168.1.251', 'result':false}
  ]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(isNotExcludedUrl(url)).to.equal(result)
    })
  })
})

// on firefox, fits ~3.5 letters or digits
describe('badgeCountText', () => {
  let test_cases = [
    { 'count': 1, 'result': '1' },
    { 'count': 12, 'result': '12' },
    { 'count': 123, 'result': '123' },
    { 'count': 1234, 'result': '1.2K' },
    { 'count': 1678, 'result': '1.7K' },
    { 'count': 12345, 'result': '12K' },
    { 'count': 123456, 'result': '123K' },
    { 'count': 1000000, 'result': '1M' },
    { 'count': 1234567, 'result': '1M' },
    { 'count': 8765432, 'result': '9M' },
    { 'count': 12000000, 'result': '12M' },
    { 'count': 12876543, 'result': '13M' },
    { 'count': 123000000, 'result': '123M' },
    { 'count': 123456789, 'result': '123M' },
  ]
  test_cases.forEach(({ count, result }) => {
    it('should return ' + result + ' on ' + count, () => {
      expect(badgeCountText(count)).to.equal(result)
    })
  })
})

describe('timestampToDate', () => {
  let test_cases = [
    // timestamp format: 'yyyyMMddHHmmss'
    { 'timestamp': '19981205021324', 'result': new Date(Date.UTC(1998, 11,  5,  2, 13, 24)) },
    { 'timestamp': '20010105131425', 'result': new Date(Date.UTC(2001,  0,  5, 13, 14, 25)) },
    { 'timestamp': '20010905131400', 'result': new Date(Date.UTC(2001,  8,  5, 13, 14,  0)) },
    { 'timestamp': '20010105130000', 'result': new Date(Date.UTC(2001,  0,  5, 13,  0,  0)) },
    { 'timestamp': '20011130000000', 'result': new Date(Date.UTC(2001, 10, 30,  0,  0,  0)) },
    { 'timestamp': '200101050000', 'result': new Date(Date.UTC(2001,  0,  5,  0,  0,  0)) },
    { 'timestamp': '2001010500', 'result': new Date(Date.UTC(2001,  0,  5,  0,  0,  0)) },
    { 'timestamp': '19981205', 'result': new Date(Date.UTC(1998, 11, 5)) },
    { 'timestamp': '199908', 'result': new Date(Date.UTC(1999, 7, 1)) },
    { 'timestamp': '1999', 'result': new Date(Date.UTC(1999, 0, 1)) },
    { 'timestamp': '19', 'result': null },
    { 'timestamp': 'abcdef', 'result': null },
    // { 'timestamp': '1999abcd', 'result': null }, // skip
  ]
  test_cases.forEach(({ timestamp, result }) => {
    it('should return ' + (result ? result.toUTCString() : 'null') + ' on ' + timestamp, () => {
      assert.deepStrictEqual(timestampToDate(timestamp), result)
    })
  })
})
