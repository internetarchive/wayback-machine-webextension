const path = '../webextension/scripts/wikipedia'
const expect = require('chai').expect
const assert = require('assert').strict

const extractISBN = require(path).extractISBN
const isISBN = require(path).isISBN
const isWikipediaUrl = require(path).isWikipediaUrl

describe('wikipedia.js extractISBN(url)', () => {
  let test_cases = [
    { 'url': 'http://wikipedia.org', 'result': 'wikipedia.org' },
    { 'url': 'https://wikipedia.org', 'result': 'wikipedia.org' },
    { 'url': 'https://en.wikipedia.org/wiki/Special:BookSources/978-0-9783318-1-8', 'result': '9780978331818' },
    { 'url': 'https://en.wikipedia.org/wiki/Special:BookSources/0-8129-2343-X', 'result': '081292343X' },
    { 'url': 'https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Ouvrages_de_r%C3%A9f%C3%A9rence/978-84-9761-902-8', 'result': '9788497619028' },
    { 'url': 'https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Ouvrages_de_r%C3%A9f%C3%A9rence/84-9761-902-1', 'result': '8497619021' },
    { 'url': 'https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Ouvrages_de_r%C3%A9f%C3%A9rence/2-904918-09-4', 'result': '2904918094' },
    { 'url': 'https://example.com/012-34-56-78-9', 'result': '0123456789' },
    { 'url': '', 'result': '' },
    { 'url': null, 'result': '' },
    { 'url': undefined, 'result': '' }
  ]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(extractISBN(url)).to.equal(result)
    })
  })
})

describe('wikipedia.js isISBN(isbn)', () => {
  let test_cases = [
    // actual ISBNs found on wikipedia
    { 'isbn': '9780978331818', 'result': true },
    { 'isbn': '9788497619028', 'result': true },
    { 'isbn': '8497619021', 'result': true },
    { 'isbn': '0714647535', 'result': true },
    { 'isbn': '1400040051', 'result': true },
    // ISBN-10 with 'X' as check digit
    { 'isbn': '081292343X', 'result': true },
    // random numbers manually verified to pass check digit test
    { 'isbn': '0123456789', 'result': true },
    { 'isbn': '5555555555', 'result': true },
    // correct prefix but wouldn't normally pass check digit
    { 'isbn': '9780000000000', 'result': true },
    { 'isbn': '9790000000000', 'result': true },
    // invalid ISBNs
    { 'isbn': '8497619022', 'result': false },
    { 'isbn': '8497519021', 'result': false },
    { 'isbn': '1234567890', 'result': false },
    { 'isbn': '4444444445', 'result': false },
    { 'isbn': '9770000000000', 'result': false },
    { 'isbn': '1234567890123', 'result': false },
    { 'isbn': 'wikipedia.org', 'result': false },
    { 'isbn': '', 'result': false },
    { 'isbn': null, 'result': false },
    { 'isbn': undefined, 'result': false }
  ]
  test_cases.forEach(({ isbn, result }) => {
    it('should return ' + result + ' on ' + isbn, () => {
      expect(isISBN(isbn)).to.equal(result)
    })
  })
})

describe('wikipedia.js isWikipediaUrl(url)', () => {
  let test_cases = [
    { 'url': 'http://wikipedia.org', 'result': true },
    { 'url': 'https://wikipedia.org', 'result': true },
    { 'url': 'http://www.wikipedia.org', 'result': true },
    { 'url': 'https://www.wikipedia.org', 'result': true },
    { 'url': 'https://en.wikipedia.org/wiki/Main_Page', 'result': true },
    { 'url': 'https://fr.wikipedia.org/wiki/Wikipédia:Accueil_principal', 'result': true },
    { 'url': 'https://ja.wikipedia.org/wiki/メインページ', 'result': true },
    { 'url': 'https://en.m.wikipedia.org/wiki/Main_Page', 'result': true },
    { 'url': 'https://simple.wikipedia.org/wiki/Main_Page', 'result': true },
    { 'url': 'https://simple.m.wikipedia.org/wiki/Main_Page', 'result': true },
    { 'url': 'http://example.com', 'result': false },
    { 'url': 'https://example.com', 'result': false },
    { 'url': 'http://some.other.wiki.org', 'result': false },
    { 'url': 'file://example.html', 'result': false },
    { 'url': 'wikipedia.org', 'result': false },
    { 'url': '', 'result': false }
  ]
  test_cases.forEach(({ url, result }) => {
    it('should return ' + result + ' on ' + url, () => {
      expect(isWikipediaUrl(url)).to.equal(result)
    })
  })
  it('should reject non-strings', () => {
    let result = isWikipediaUrl(5) || isWikipediaUrl({}) || isWikipediaUrl(true)
    expect(result).to.be.false
  })
})
