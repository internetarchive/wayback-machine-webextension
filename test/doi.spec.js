const dom = require("./setup").jsdom;
const expect = require("chai").expect;
const getMetadata = require("../scripts/doi").getMetadata;

describe('doi: getMetadata()', () =>{
  let response = {
    "abstracts": [],
    "container_id": "hcivi5alwffalcl3q2yireetlm",
    "contribs": [
      {
        "extra": {
          "sequence": "first"
        },
        "index": 0,
        "raw_name": "David R. Gibson",
        "role": "author"
      }
    ],
    "count_files": 1,
    "doi": "10.1086/661761",
    "extra": {
      "crossref": {
        "alternative-id": [
          "10.1086/661761"
        ],
        "container-title": [
          "American Journal of Sociology"
        ],
        "is_kept": false,
        "type": "journal-article"
      }
    },
    "ident": "qlymqxxsx5gttocoz77hq3e5ju",
    "issue": "2",
    "pages": "361-419",
    "publisher": "University of Chicago Press",
    "refs": [],
    "release_date": "2011-01-01T00:00:00Z",
    "release_status": "published",
    "release_type": "journal-article",
    "revision": "844a08b1-ab28-4b1b-bcda-350baa55bf08",
    "source": "archive.org",
    "state": "active",
    "title": "Avoiding Catastrophe: The Interactional Production of Possibility                     during the Cuban Missile Crisis",
    "url": "https://web.archive.org/web/2017/http://www.belfercenter.org/sites/default/files/legacy/files/CMC50/DavidGibsonAvoidingCatastropheTheInteractionalProductionofPossibilityDuringTheCubanMissileCrisisAmericanJournalofSociology.pdf",
    "volume": "117",
    "wikidata_qid": "Q56040827",
    "work_id": "3xykhxcnubhqrcjz3k5f46fkxq"
  };
  it('should normalize data from response', ()=> {
    let result = getMetadata(response);
    expect(result).to.have.keys(["title", "author", "journal", "url", "source"]);
  });
});
