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

describe('isValidUrl', ()=>{
  it('should reject non-strings', ()=>{
    let result = isValidUrl(5) || isValidUrl({}) || isValidUrl(true)
    expect(result).to.be.false
  })
  it('should reject impropper protocols', ()=>{
    let result = isValidUrl('chrome://extension')
    expect(result).to.be.false

  })
  it('should accept propper urls', ()=>{
    let result = isValidUrl('https://example.com/')
    expect(result).to.be.true
  })
})

describe('isNotExcludedUrl', () =>{
  var excluded_urls = [
    "localhost",
    "0.0.0.0",
    "127.0.0.1"
  ];
  it('should reject urls on the excluded list', ()=>{
    let result = isNotExcludedUrl('https://0.0.0.0', excluded_urls)
    expect(result).to.be.false
  })
  it('should accept urls not on the list', ()=>{
    let result = isNotExcludedUrl('https://example.com', excluded_urls)
    expect(result).to.be.true
  })
})
