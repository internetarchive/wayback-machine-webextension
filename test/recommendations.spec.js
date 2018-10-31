const dom = require("./setup").jsdom;
const expect = require("chai").expect;
const parseDate = require("../scripts/recommendations").parseDate;

describe('parseDate', () => {
  var tests = [
    {
      'input' : '20181025T144028Z',
      'expected' : 'Wed Oct 24 2018'
    },
    {
      'input' : '201805',
      'expected' : 'Tue May 01 2018'
    },
    {
      'input' : '201704ab',
      'expected' : ''
    },
    {
      'input' : false,
      'expected' : ''
    },
    {
      'input' : '',
      'expected' : ''
    },
    {
      'input' : '20184050',
      'expected' : ''
    }
  ];

  it('should return a formatted date string on success', () => {
    let result = parseDate(tests[0]['input']);
    expect(result).to.equal(tests[0]['expected']);
  });
  it('should return first of month if no day specified', () => {
    let result = parseDate(tests[1]['input']);
    expect(result).to.equal(tests[1]['expected']);
  });
  it('should return empty string on impropperly formatted date input string', () => {
    let result = parseDate(tests[2]['input']);
    expect(result).to.equal(tests[2]['expected']);
  });
  it('should return empty string on non-string input', () => {
    let result = parseDate(tests[3]['input']);
    expect(result).to.equal(tests[3]['expected']);
  });
  it('should return empty string on empty string input', () => {
    let result = parseDate(tests[4]['input']);
    expect(result).to.equal(tests[4]['expected']);
  });
  it('should return empty string on invalid date values', () => {
    let result = parseDate(tests[5]['input']);
    expect(result).to.equal(tests[5]['expected']);
  });
});
