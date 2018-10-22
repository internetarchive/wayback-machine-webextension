const expect = require('chai').expect
const hypothesis_api_url = require('../scripts/annotation').hypothesis_api_url

describe('annotation', () => {
  it('should format hypothes.is API URL correctly', () => {
    var url1 = 'example.com'
    expect(hypothesis_api_url(url1, 'domain')).to.be.equal('https://hypothes.is/api/search?uri.parts=example&uri.parts=com')
    expect(hypothesis_api_url(url1, 'url')).to.be.equal('https://hypothes.is/api/search?uri=http://example.com')

    var url2 = 'http://iskme.org/our-ideas/well-rounded-lesson-history-and-common-core-math-work-together-when-teachers-and-students-';
    expect(hypothesis_api_url(url2, 'domain')).to.be.equal('https://hypothes.is/api/search?uri.parts=iskme&uri.parts=org')
    expect(hypothesis_api_url(url2, 'url')).to.be.equal('https://hypothes.is/api/search?uri=' + url2)

    var url3 = 'https://www.lifo.gr/'
    expect(hypothesis_api_url(url3, 'domain')).to.be.equal('https://hypothes.is/api/search?uri.parts=www&uri.parts=lifo&uri.parts=gr')
    expect(hypothesis_api_url(url3, 'url')).to.be.equal('https://hypothes.is/api/search?uri=' + url3)
  })
})
