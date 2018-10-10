const dom = require("./setup").jsdom;
const expect = require("chai").expect;
const getUrlByParameter = require("../scripts/doi").getUrlByParameter;

describe('doi', () =>{
  it('should extract wikipedia url', () =>{
    dom.reconfigure({url: "chrome-extension://hkahpanhaccgppbidkekeijffcdppdan/booklist.html?url=https://en.wikipedia.org/wiki/Easter_Island"});
    let wikiURL = getUrlByParameter("url");
    expect(wikiURL).to.be.equal("https://en.wikipedia.org/wiki/Easter_Island");
  });
});
