const expect = require('chai').expect
const parseDate = require('../webextension/scripts/tvnews').parseDate

describe('parseDate', () => {
  var tests = [
    {
      'input': '2019-01-29T16:00:00Z',
      'expected': 'Tue Jan 29 2019'
    },
    {
      'input': '201901',
      'expected': 'Tue Jan 01 2019'
    },
    {
      'input': '201704ab',
      'expected': ''
    },
    {
      'input': false,
      'expected': ''
    },
    {
      'input': '',
      'expected': ''
    },
    {
      'input': '20184050',
      'expected': ''
    }
  ]

  it('should return a formatted date string on success', () => {
    let result = parseDate(tests[0]['input'])
    expect(result).to.equal(tests[0]['expected'])
  })
  it('should return empty string on impropperly formatted date input string', () => {
    let result = parseDate(tests[2]['input'])
    expect(result).to.equal(tests[2]['expected'])
  })
  it('should return empty string on non-string input', () => {
    let result = parseDate(tests[3]['input'])
    expect(result).to.equal(tests[3]['expected'])
  })
  it('should return empty string on empty string input', () => {
    let result = parseDate(tests[4]['input'])
    expect(result).to.equal(tests[4]['expected'])
  })
  it('should return empty string on invalid date values', () => {
    let result = parseDate(tests[5]['input'])
    expect(result).to.equal(tests[5]['expected'])
  })
})
