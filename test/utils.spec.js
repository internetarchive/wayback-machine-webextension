const dom = require('./setup').jsdom
const expect = require('chai').expect
const assert = require('assert').strict
const getUrlByParameter = require('../webextension/scripts/utils').getUrlByParameter
const isArchiveUrl = require('../webextension/scripts/utils').isArchiveUrl
const isValidUrl = require('../webextension/scripts/utils').isValidUrl
const get_clean_url = require('../webextension/scripts/utils').get_clean_url
const isNotExcludedUrl = require('../webextension/scripts/utils').isNotExcludedUrl
const badgeCountText = require('../webextension/scripts/utils').badgeCountText
const timestampToDate = require('../webextension/scripts/utils').timestampToDate
const dateToTimestamp = require('../webextension/scripts/utils').dateToTimestamp
const makeValidURL = require('../webextension/scripts/utils').makeValidURL
const cropPrefix = require('../webextension/scripts/utils').cropPrefix

describe('twitter', () => {
  it('should extract correct tweet url', () => {
    dom.reconfigure({ url: 'chrome-extension://hkahpanhaccgppbidkekeijffcdppdan/twitter.html?url=https://archive.org/' })
    let tweetURL = getUrlByParameter('url')
    expect(tweetURL).to.be.equal('https://archive.org/')
  })
})

describe('isArchiveUrl', () => {
  var test_cases = [
    { 'url': 'http://archive.org', 'result': true },
    { 'url': 'https://archive.org', 'result': true },
    { 'url': 'http://archive.org/some/path/?key=value', 'result': true },
    { 'url': 'https://web.archive.org', 'result': true },
    { 'url': 'https://web.archive.org/some/path', 'result': true },
    { 'url': 'http://example.com', 'result': false },
    { 'url': 'https://example.com', 'result': false },
    { 'url': 'http://anotherarchive.org', 'result': false },
    { 'url': 'file://example.html', 'result': false },
    { 'url': 'archive.org', 'result': false },
    { 'url': '', 'result': false }
  ]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(isArchiveUrl(url)).to.equal(result)
    })
  })
  it('should reject non-strings', () => {
    let result = isArchiveUrl(5) || isArchiveUrl({}) || isArchiveUrl(true)
    expect(result).to.be.false
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
    { 'url': 'about:home', 'result': false},
    { 'url': '192.168.1.251', 'result': false},
    { 'url': 'edge://extensions', 'result': false},
    { 'url': 'edge://about', 'result': false},
    { 'url': 'extension://', 'result': false}
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

describe('get_clean_url', () => {
  var test_cases = [
    //Test Case when the URL is https://web.archive.org
    { 'url': 'https://web.archive.org', 'result': 'https://web.archive.org' },

    //Test Cases when the URL does not includes 'web.archive.org'
    { 'url': 'https://www.google.com/', 'result': 'https://www.google.com/' },
    { 'url': 'https://www.amazon.in/End-Days-Predictions-Prophecies-Thorndike/dp/1410407462', 'result': 'https://www.amazon.in/End-Days-Predictions-Prophecies-Thorndike/dp/1410407462' },
    { 'url': 'http://purl.oclc.org/docs/inet96.html', 'result': 'http://purl.oclc.org/docs/inet96.html' },
    { 'url': 'https://apnews.com/', 'result': 'https://apnews.com/' },

    //Test Cases when the URL includes 'web.archive.org'
    { 'url': 'https://web.archive.org/web/*/https://www.google.com/', 'result': 'https://www.google.com/' },
    { 'url': 'https://web.archive.org/web/*/https://www.amazon.in/End-Days-Predictions-Prophecies-Thorndike/dp/1410407462', 'result': 'https://www.amazon.in/End-Days-Predictions-Prophecies-Thorndike/dp/1410407462' },
    { 'url': 'https://web.archive.org/web/*/http://purl.oclc.org/docs/inet96.html', 'result': 'http://purl.oclc.org/docs/inet96.html' },
    { 'url': 'https://web.archive.org/web/*/https://apnews.com/', 'result': 'https://apnews.com/' },
    { 'url': 'https://web.archive.org/web/20200205001304/https://www.google.com/', 'result': 'https://www.google.com/' },
    { 'url': 'https://web.archive.org/web/20200602155930/https://www.amazon.in/End-Days-Predictions-Prophecies-Thorndike/dp/1410407462', 'result': 'https://www.amazon.in/End-Days-Predictions-Prophecies-Thorndike/dp/1410407462' },
    { 'url': 'https://web.archive.org/web/20200215123917/http://purl.oclc.org/docs/inet96.html', 'result': 'http://purl.oclc.org/docs/inet96.html' },
    { 'url': 'https://web.archive.org/web/20200308013652/https://apnews.com/', 'result': 'https://apnews.com/' },
  ]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(get_clean_url(url)).to.equal(result)
    })
  })
})

describe('isNotExcludedUrl', () => {
  var test_cases = [
    { 'url': 'https://0.0.0.0', 'result': false },
    { 'url': 'https://localhost', 'result': false },
    { 'url': 'https://127.0.0.1', 'result': false },
    { 'url': 'chrome-extension://qwertyuiop/example.html?url=https://www.example.com/', 'result': false },
    { 'url': 'chrome://extensions', 'result': false },
    { 'url': 'chrome://newtab', 'result': false },
    { 'url': 'https://example.com', 'result': true },
    { 'url': '\xc3\xb1', 'result': true },
    { 'url': '\xc3\x28', 'result': true },
    { 'url': 'about:newtab', 'result': false },
    { 'url': 'about:home', 'result': false },
    { 'url': 'about:preferences', 'result': false },
    { 'url': 'about:debugging', 'result': false },
    { 'url': '192.168.1.251', 'result': false },
    { 'url': 'http://10.0.0.1', 'result': false },
    { 'url': 'file://example', 'result': false },
    { 'url': 'edge://newtab', 'result': false},
    { 'url': 'edge://about', 'result': false},
    { 'url': 'edge://favorites', 'result': false},
    { 'url': 'extension://', 'result': false},
    { 'url': '   ', 'result': false},
    { 'url': '', 'result': false}
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

describe('dateToTimestamp', () => {
  let test_cases = [
    // result format: 'yyyyMMddHHmmss'
    { 'result': '19981205021324', 'date': new Date(Date.UTC(1998, 11,  5,  2, 13, 24)) },
    { 'result': '20010105131425', 'date': new Date(Date.UTC(2001,  0,  5, 13, 14, 25)) },
    { 'result': '20010905131400', 'date': new Date(Date.UTC(2001,  8,  5, 13, 14,  0)) },
    { 'result': '20010105130000', 'date': new Date(Date.UTC(2001,  0,  5, 13,  0,  0)) },
    { 'result': '20011130000000', 'date': new Date(Date.UTC(2001, 10, 30,  0,  0,  0)) },
    { 'result': '20010105000000', 'date': new Date(Date.UTC(2001,  0,  5,  0,  0,  0)) },
    { 'result': '20010105000000', 'date': new Date(Date.UTC(2001,  0,  5,  0,  0,  0)) },
    { 'result': '19981205000000', 'date': new Date(Date.UTC(1998, 11, 5)) },
    { 'result': null, 'date': 'NOT A DATE' },
    { 'result': null, 'date': null },
  ]
  test_cases.forEach(({ date, result }) => {
    it('should return ' + (result ? result : 'null') + ' on ' + date, () => {
      assert.deepStrictEqual(dateToTimestamp(date), result)
    })
  })
})

describe('makeValidURL', () => {
  var test_cases = [
    { 'url': 'https://www.google.com/', 'result': 'https://www.google.com/' },
    { 'url': 'www.google.com/', 'result': 'https://www.google.com/' },
    { 'url': 'google.com', 'result': 'https://google.com' },
    { 'url': 'google', 'result': null },
    { 'url': 'https://www.alexa.com/', 'result': 'https://www.alexa.com/' },
    { 'url': 'www.alexa.com/', 'result': 'https://www.alexa.com/' },
    { 'url': 'alexa.com/', 'result': 'https://alexa.com/' },
    { 'url': 'alexa', 'result': null },
    { 'url': 'http://purl.oclc.org/docs/inet96.html', 'result': 'http://purl.oclc.org/docs/inet96.html' },
    { 'url': 'purl.oclc.org/docs/inet96.html', 'result': 'https://purl.oclc.org/docs/inet96.html' },
    { 'url': 'purl.oclc.org', 'result': 'https://purl.oclc.org' },
    { 'url': 'purl', 'result': null }
]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(makeValidURL(url)).to.equal(result)
    })
  })
})

describe('cropPrefix', () => {
  var test_cases = [
    { 'url': 'https://www.example.com/', 'result': 'example.com' },
    { 'url': 'http://www.example.com/', 'result': 'example.com' },
    { 'url': 'https://example.com', 'result': 'example.com' },
    { 'url': 'http://example.com', 'result': 'example.com' },
    { 'url': 'https://foo.example.com', 'result': 'foo.example.com' },
    { 'url': 'http://foo.example.com', 'result': 'foo.example.com' },
    { 'url': 'example', 'result': 'example' },
    { 'url': 'example.com', 'result': 'example.com' },
    { 'url': 'www.example.com/', 'result': 'example.com' },
    { 'url': 'https://foo.example.com/foo/bar?baz#buz', 'result': 'foo.example.com/foo/bar?baz#buz' },
    { 'url': 'http://foo.example.com/foo/bar?baz#buz', 'result': 'foo.example.com/foo/bar?baz#buz' },
    { 'url': 'www.example.com/www/foo.html', 'result': 'example.com/www/foo.html' },
    { 'url': 'www.example.com/www.html', 'result': 'example.com/www.html' },
    { 'url': 'http://example.com/www/foo.html', 'result': 'example.com/www/foo.html' },
    { 'url': 'example.com/www.html', 'result': 'example.com/www.html' },
    { 'url': 'www.example.com/www/foo.html', 'result': 'example.com/www/foo.html' },
    { 'url': 'www.example.com/www.html', 'result': 'example.com/www.html' },
    { 'url': 'foo.www.example.com', 'result': 'foo.www.example.com' },
    { 'url': 'ftp://example.com/', 'result': 'example.com' },
    { 'url': 'ftp://www.example.com/', 'result': 'example.com' },
    { 'url': 'https://example.com/foo/https://www.example.org/', 'result': 'example.com/foo/https://www.example.org' },
    { 'url': '', 'result': '' },
    { 'url': null, 'result': null },
    { 'url': undefined, 'result': null },
]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(cropPrefix(url)).to.equal(result)
    })
  })
})
