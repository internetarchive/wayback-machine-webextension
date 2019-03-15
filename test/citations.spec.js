const expect = require("chai").expect;
const getCitation = require("../scripts/citations").getCitation


describe('getCitation', ()=>{

  it('should return null on non-citations', ()=>{
    let result = getCitation('')
    expect(result).to.be.null
  })
  it('should parse title, author, publisher, and page numbers.  null if not provided', ()=>{
    test_cases = [
      {
        case: '<a href="#_ftnref1" name="_ftn1" title="" id="_ftn1">[1]</a>Herman J. Levine and Benjamin Miller, <em>The American Jewish Farmer in Changing Times</em> (New York: The Jewish Agricultural Society, Inc. 1966) 19, 21, 50.',
        result: {
          title: 'The American Jewish Farmer in Changing Times',
          author: 'Herman J. Levine and Benjamin Miller',
          pages: [19, 21, 50],
          // publisher: 'New York: The Jewish Agricultural Society, Inc. 1966'
        }
      },
      {
        case: '<a href="#_ftnref3" name="_ftn3" title="" id="_ftn3">[3]</a>Uri D. Herscher, <em>Jewish Agricultural Utopias in America, 1880-1910</em> (Detroit: Wayne State University Press, 1991), 123.',
        result: {
          title: 'Jewish Agricultural Utopias in America, 1880-1910',
          author: 'Uri D. Herscher',
          pages: [123],
          // publisher: 'Detroit: Wayne State University Press, 1991'
        }
      }
    ]
    for(let i = 0; i < test_cases.length; i++){
      let result = getCitation(test_cases[i].case);
      expect(result).to.eql(test_cases[i].result)
    }
  })
})
