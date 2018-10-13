const dom = require("./setup").jsdom;
const expect = require("chai").expect;
const getISBNFromCitation = require("../scripts/wikipedia").getISBNFromCitation;
const getIdentifierFromISBN = require("../scripts/wikipedia").getIdentifierFromISBN;

describe('getISBNFromCitation', () =>{

  function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
  }
  let html_snippets = [
    {
      "html":'<cite class="citation book">Dos Passos, John, (2011). <a rel="nofollow" class="external text" href="https://www.worldcat.org/oclc/773372948"><i>Easter Island&nbsp;: island of enigmas</i></a>. Doubleday. <a href="/wiki/International_Standard_Book_Number" title="International Standard Book Number">ISBN</a>&nbsp;<a href="/wiki/Special:BookSources/9780307787057" title="Special:BookSources/9780307787057">9780307787057</a>. <a href="/wiki/OCLC" title="OCLC">OCLC</a>&nbsp;<a rel="nofollow" class="external text" href="//www.worldcat.org/oclc/773372948">773372948</a>.</cite>',
      "isbn": "9780307787057"
    },
    {
      "html" : '<cite class="citation book">Franklin, Jane (1997). <a rel="nofollow" class="external text" href="http://andromeda.rutgers.edu/~hbf/missile.htm"><i>Cuba and the United States: A Chronological History</i></a>. Melbourne: Ocean Press. <a href="/wiki/International_Standard_Book_Number" title="International Standard Book Number">ISBN</a>&nbsp;<a href="/wiki/Special:BookSources/1-875284-92-3" title="Special:BookSources/1-875284-92-3">1-875284-92-3</a>.</cite>',
      "isbn" :   "1875284923"
    },
    {
      "html" :'<cite class="citation book">Stern, Sheldon M. (2012). <i>The Cuban Missile Crisis in American Memory: Myths versus Reality</i>. Stanford nuclear age series. Stanford, Calif: Stanford University Press.</cite>',
      "isbn" : null
    }
  ];

  it('should extract an ISBN number when citation references ISBN, or return null if no isbn found.', () =>{
    for(let i = 0; i < html_snippets.length; i++){
      let html = html_snippets[i]['html'];
      let citation = htmlToElement(html);
      let result = getISBNFromCitation(citation);
      expect(result).to.equal(html_snippets[i]['isbn']);
    }
  });
});

describe('getIdentifierFromISBN', ()=>{
  let json = {
    "1565844742": {
      "1565844742": {
        "responses": {
          "OL8885525W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "1875284923": {
      "1875284923": {
        "responses": {
          "OL1638144W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "0043270247": null,
    "0160452104": null,
    "0321013492": {
      "0321013492": {
        "responses": {
          "OL1950302W": {
            "collection": "inlibrary,printdisabled,internetarchivebooks,americana,fav-luiza_paranagua",
            "identifier": "essenceofdecisio00alli",
            "isbn": null,
            "last_loan_date": "2018-09-24T11:38:12Z",
            "last_waitlist_date": "2018-10-06T16:42:16Z",
            "num_waitlist": "1",
            "oclc": null,
            "openlibrary_edition": "OL5707477M",
            "openlibrary_work": "OL1950302W",
            "status": "borrow_unavailable"
          }
        },
        "success": true
      }
    },
    "0674455320": null,
    "178594259X": null,
    "9780060921781": {
      "9780060921781": {
        "responses": {
          "OL273253W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780141026268": {
      "9780141026268": {
        "responses": {
          "OL16457198W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780198253204": {
      "9780198253204": {
        "responses": {
          "OL2930487W": {
            "collection": "inlibrary,printdisabled,internetarchivebooks,china",
            "identifier": "cubanmissilecris00chay",
            "isbn": "0198253206",
            "last_loan_date": "2018-10-11T22:31:19Z",
            "last_waitlist_date": "2018-02-14T23:38:01Z",
            "num_waitlist": "0",
            "oclc": null,
            "openlibrary_edition": "OL5094548M",
            "openlibrary_work": "OL2930487W",
            "status": "borrow_available"
          }
        },
        "success": true
      }
    },
    "9780300065978": null,
    "9780300087000": {
      "9780300087000": {
        "responses": {
          "OL4645931W": {
            "collection": "inlibrary,printdisabled,internetarchivebooks,china",
            "identifier": "humanitymoralhis00glov_0",
            "isbn": "9780300087000",
            "last_loan_date": "2018-10-12T20:22:09Z",
            "last_waitlist_date": null,
            "num_waitlist": "0",
            "oclc": null,
            "openlibrary_edition": "OL6784493M",
            "openlibrary_work": "OL4645931W",
            "status": "borrow_available"
          }
        },
        "success": true
      }
    },
    "9780321013491": null,
    "9780345465054": null,
    "9780374226343": null,
    "9780393098969": null,
    "9780393317909": null,
    "9780393318340": {
      "9780393318340": {
        "responses": {
          "OL2011065W": {
            "collection": "inlibrary,printdisabled,internetarchivebooks,china,fav-usuario2018,fav-fmg04",
            "identifier": "thirteendaysmemo00kenn",
            "isbn": null,
            "last_loan_date": "2018-09-27T23:15:52Z",
            "last_waitlist_date": "2018-10-08T22:10:52Z",
            "num_waitlist": "1",
            "oclc": null,
            "openlibrary_edition": "OL14413577M",
            "openlibrary_work": "OL2011065W",
            "status": "borrow_unavailable"
          }
        },
        "success": true
      }
    },
    "9780393322590": {
      "9780393322590": {
        "responses": {
          "OL2890639W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780471670223": null,
    "9780618219285": {
      "9780618219285": {
        "responses": {
          "OL15123199W": {
            "collection": "inlibrary,printdisabled,internetarchivebooks,americana,fav-samirah_y_sartor,smithsonianlibraries",
            "identifier": "robertkennedyhis01schl",
            "isbn": "0395248973",
            "last_loan_date": "2018-10-11T15:27:57Z",
            "last_waitlist_date": null,
            "num_waitlist": "0",
            "oclc": null,
            "openlibrary_edition": "OL4721369M",
            "openlibrary_work": "OL15123199W",
            "status": "borrow_available"
          }
        },
        "success": true
      }
    },
    "9780671667214": {
      "9780671667214": {
        "responses": {
          "OL13418598W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780691151311": {
      "9780691151311": {
        "responses": {
          "OL16343031W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780742522695": null,
    "9780742580220": null,
    "9780764323461": {
      "9780764323461": {
        "responses": {
          "OL4781009W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780804748469": null,
    "9780804750776": {
      "9780804750776": {
        "responses": {
          "OL8444291W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780804793360": null,
    "9780807828281": {
      "9780807828281": {
        "responses": {
          "OL5852635W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780816631117": null,
    "9780819125842": null,
    "9780873489560": null,
    "9780910129152": null,
    "9780964107731": {
      "9780964107731": {
        "responses": {
          "OL3543320W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9780971139152": {
      "9780971139152": {
        "responses": {
          "OL5120800W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781317555414": null,
    "9781400043583": {
      "9781400043583": {
        "responses": {
          "OL2006844W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781400078912": {
      "9781400078912": {
        "responses": {
          "OL14991585W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781402763021": {
      "9781402763021": {
        "responses": {
          "OL15051317W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781442216792": {
      "9781442216792": {
        "responses": {
          "OL16714808W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781565844742": {
      "9781565844742": {
        "responses": {
          "OL8885525W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781580070713": {
      "9781580070713": {
        "responses": {
          "OL3460835W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781608196708": {
      "9781608196708": {
        "responses": {
          "OL17838533W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781610690669": {
      "9781610690669": {
        "responses": {
          "OL16416496W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9781929631087": null,
    "9781929631759": {
      "9781929631759": {
        "responses": {
          "OL16986501W": {
            "error_message": "not found",
            "status": "error"
          }
        },
        "success": true
      }
    },
    "9788800745321": null
  };
  it('should return the archive identifier if it can be found in the json', ()=>{
    let result = getIdentifierFromISBN("0321013492", json);
    expect(result).to.equal("essenceofdecisio00alli");
  });
  it('should return null when no identifier is found', ()=>{
    let result1 = getIdentifierFromISBN("0043270247", json);
    expect(result1).to.be.null;
    let result2 = getIdentifierFromISBN("9780393322590", json);
    expect(result2).to.be.null;
  });
});
