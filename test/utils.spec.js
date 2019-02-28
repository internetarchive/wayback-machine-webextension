const dom = require('./setup').jsdom
const expect = require('chai').expect
const getUrlByParameter = require('../scripts/utils').getUrlByParameter
const isValidUrl = require('../scripts/utils').isValidUrl
const isNotExcludedUrl = require('../scripts/utils').isNotExcludedUrl

describe('twitter', () => {
  it('should extract correct tweet url', () => {
    dom.reconfigure({ url: 'chrome-extension://hkahpanhaccgppbidkekeijffcdppdan/twitter.html?url=https://archive.org/' })
    let tweetURL = getUrlByParameter('url')
    expect(tweetURL).to.be.equal('https://archive.org/')
  })
})

describe('isValidUrl', () => {
  var test_cases = [
    { 'url': 'chrome://extension', 'result': false },
    { 'url': 'https://example.com', 'result': true },
    { 'url': 'https://\xc3\xb1', 'result': true },
    { 'url': 'http://\xc3\x28', 'result': true },
    { 'url': '\xc3\xb1', 'result': false },
    { 'url': '\xc3\x28', 'result': false }
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
    { 'url': 'https://example.com', 'result': true },
    { 'url': '\xc3\xb1', 'result': true },
    { 'url': '\xc3\x28', 'result': true }
  ]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(isNotExcludedUrl(url)).to.equal(result)
    })
  })
})
