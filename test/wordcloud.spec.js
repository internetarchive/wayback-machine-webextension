const expect = require('chai').expect
const toConsumableArray = require('../webextension/scripts/wordcloud').toConsumableArray

describe('wordcloud', () => {
  it('should execute the toConsumableArray function correctly by checking the array', () => {
    var array1 = [2001, 2003, 2004, 2005, 2006]
    var response1 = toConsumableArray(array1)
    for (var i = 0; i < response1.length; i++) {
      expect(response1[i]).to.equal(array1[i])
    }
    var array2 = 'ABCDEF'
    var response2 = toConsumableArray(array2)
    for (var i = 0; i < response2.length; i++) {
      expect(array2.charAt(i)).to.equal(response2[i])
    }
  })
})
