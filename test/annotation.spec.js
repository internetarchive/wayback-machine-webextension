const dom = require('./setup').jsdom
const expect = require('chai').expect
const hypothesisApiUrl = require('../webextension/scripts/annotation').hypothesisApiUrl

describe('annotation', () => {
  it('should format hypothes.is API URL correctly', () => {
    var url1 = 'example.com'
    expect(hypothesisApiUrl(url1, 'domain')).to.be.equal('https://hypothes.is/api/search?uri.parts=example&uri.parts=com')
    expect(hypothesisApiUrl(url1, 'url')).to.be.equal('https://hypothes.is/api/search?uri=http://example.com')

    var url2 = 'http://iskme.org/our-ideas/well-rounded-lesson-history-and-common-core-math-work-together-when-teachers-and-students-'
    expect(hypothesisApiUrl(url2, 'domain')).to.be.equal('https://hypothes.is/api/search?uri.parts=iskme&uri.parts=org')
    expect(hypothesisApiUrl(url2, 'url')).to.be.equal('https://hypothes.is/api/search?uri=' + url2)

    var url3 = 'https://www.lifo.gr/'
    expect(hypothesisApiUrl(url3, 'domain')).to.be.equal('https://hypothes.is/api/search?uri.parts=www&uri.parts=lifo&uri.parts=gr')
    expect(hypothesisApiUrl(url3, 'url')).to.be.equal('https://hypothes.is/api/search?uri=' + url3)
  })
})
