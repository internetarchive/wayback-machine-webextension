const expect = require('chai').expect
const getCitation = require('../scripts/citations').getCitation
const getAdvancedSearchQuery = require('../scripts/citations').getAdvancedSearchQuery

test_cases = [
  {
    case: '[1]Herman J. Levine and Benjamin Miller, The American Jewish Farmer in Changing Times (New York: The Jewish Agricultural Society, Inc. 1966) 19, 21, 50.',
    parsed: {
      title: 'The American Jewish Farmer in Changing Times',
      author: 'Herman J. Levine and Benjamin Miller',
      pages: [19, 21, 50],
      publisher: 'New York: The Jewish Agricultural Society, Inc. 1966'
    },
    query: 'creator:Herman J. Levine Benjamin Miller AND title:"The American Jewish Farmer in Changing Times"'
  },
  {
    case: 'Uri D. Herscher, Jewish Agricultural Utopias in America, 1880-1910 (Detroit: Wayne State University Press, 1991), 123.',
    parsed: {
      title: 'Jewish Agricultural Utopias in America, 1880-1910',
      author: 'Uri D. Herscher',
      pages: [123],
      publisher: 'Detroit: Wayne State University Press, 1991'
    },
    query: 'creator:Uri D. Herscher AND title:"Jewish Agricultural Utopias in America, 1880-1910"'
  }
]

describe('getCitation', () => {
  it('should return null on non-citations', () => {
    let parsed = getCitation('')
    expect(parsed).to.be.null
  })
  it('should parse title, author, publisher, and page numbers.  null if not provided', () => {
    for (let i = 0; i < test_cases.length; i++) {
      let parsed = getCitation(test_cases[i].case)
      expect(parsed).to.eql(test_cases[i].parsed)
    }
  })
})

describe('getAdvancedSearchQuery', ()=>{
  it('should take parsed citations and output a search query', ()=>{
    for (let i = 0; i < test_cases.length; i++) {
      let parsed = getCitation(test_cases[i].case)
      let query = getAdvancedSearchQuery(parsed)
      expect(query).to.equal(test_cases[i].query)
    }
  })
})
