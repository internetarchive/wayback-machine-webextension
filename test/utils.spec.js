const dom = require('./setup').jsdom
const expect = require('chai').expect
const getUrlByParameter = require('../scripts/utils').getUrlByParameter

describe('twitter', () => {
  it('should extract correct tweet url', () => {
    dom.reconfigure({ url: 'chrome-extension://hkahpanhaccgppbidkekeijffcdppdan/twitter.html?url=https://archive.org/' })
    let tweetURL = getUrlByParameter('url')
    expect(tweetURL).to.be.equal('https://archive.org/')
  })
})
