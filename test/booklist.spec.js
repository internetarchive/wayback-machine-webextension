const dom = require("./setup").jsdom;
const expect = require("chai").expect;
const getMetadata = require("../scripts/booklist").getMetadata;

const response = {
  "0143036556": {
    "authors": [
      {
        "key": "/authors/OL2630733A"
      }
    ],
    "authors_metadata": {
      "bio": {
        "type": "/type/text",
        "value": "Jared Mason Diamond is an American scientist and author best known for his popular science books."
      },
      "birth_date": "September 10, 1937",
      "created": {
        "type": "/type/datetime",
        "value": "2008-04-29T13:35:46.876380"
      },
      "key": "/authors/OL2630733A",
      "last_modified": {
        "type": "/type/datetime",
        "value": "2017-03-31T09:50:28.745577"
      },
      "latest_revision": 8,
      "links": [
        {
          "title": "Wikipedia Article",
          "type": {
            "key": "/type/link"
          },
          "url": "http://en.wikipedia.org/wiki/Jared_Diamond"
        }
      ],
      "name": "Jared Diamond",
      "personal_name": "Jared M. Diamond",
      "photos": [
        6776231
      ],
      "remote_ids": {
        "viaf": "90709225",
        "wikidata": "Q205772"
      },
      "revision": 8,
      "type": {
        "key": "/type/author"
      }
    },
    "covers": [
      8261366
    ],
    "created": 1540510982,
    "d1": "ia600701.us.archive.org",
    "d2": "ia800701.us.archive.org",
    "dir": "/14/items/collapse00jare",
    "files_count": 26,
    "first_sentence": "A few summers ago I visited two dairy farms, Huls Farm and Gardar Farm, which despite being located thousands of miles apart were still remarkably similar in their strengths and vulnerabilities.",
    "identifiers": {
      "goodreads": [
        "475"
      ],
      "librarything": [
        "1070881"
      ]
    },
    "isbn_10": [
      "0143036556"
    ],
    "isbn_13": [
      "9780143036555"
    ],
    "item_size": 1040317535,
    "key": "/books/OL7361580M",
    "languages": [
      {
        "key": "/languages/eng"
      }
    ],
    "last_modified": {
      "type": "/type/datetime",
      "value": "2018-10-24T13:32:16.007641"
    },
    "latest_revision": 11,
    "metadata": {
      "addeddate": "2011-09-14 20:51:10",
      "backup_location": "ia903703_5",
      "boxid": "IA170901",
      "boxid_2": "CH104001",
      "camera": "Canon EOS 5D Mark II",
      "city": "New York, NY [u.a.]",
      "collection": [
        "inlibrary",
        "printdisabled",
        "internetarchivebooks",
        "china"
      ],
      "contributor": "Internet Archive",
      "creator": "Diamond, Jared M",
      "date": "2006",
      "external-identifier": [
        "urn:acs6:collapse00jare:pdf:a36d0dbb-8de8-4722-8aea-4afe6fac1191",
        "urn:acs6:collapse00jare:epub:dfb3b11c-9f6b-490e-a3aa-0be8506963bc"
      ],
      "extramarc": "Columbia University Libraries",
      "filesxml": "Mon Oct 24 17:43:26 UTC 2011",
      "foldoutcount": "0",
      "identifier": "collapse00jare",
      "identifier-access": "http://www.archive.org/details/collapse00jare",
      "identifier-ark": "ark:/13960/t9c54p190",
      "imagecount": "622",
      "isbn": [
        "0143036556",
        "9780143036555"
      ],
      "language": "eng",
      "lccn": "2004057152",
      "loans__status__last_loan_date": "2018-10-24T16:15:02Z",
      "loans__status__num_loans": "1",
      "loans__status__num_waitlist": "0",
      "loans__status__status": "UNAVAILABLE",
      "mediatype": "texts",
      "oclc-id": [
        "255838151",
        "441719286",
        "474760948",
        "488751008",
        "493152196",
        "62868295",
        "642543102",
        "670374079",
        "803612184",
        "833419884",
        "841784213",
        "315483245",
        "757304316",
        "803897001",
        "879533232",
        "56367771"
      ],
      "ocr": "ABBYY FineReader 8.0",
      "openlibrary": "OL7361580M",
      "openlibrary_edition": "OL7361580M",
      "openlibrary_subject": "openlibrary_staff_picks",
      "openlibrary_work": "OL276557W",
      "operator": "scanner-shenzhen-cop@archive.org",
      "page-progression": "lr",
      "ppi": "500",
      "publicdate": "2011-09-14 20:51:12",
      "publisher": "New York : Penguin",
      "related-external-id": [
        "urn:isbn:0143117009",
        "urn:lccn:2011290440",
        "urn:oclc:688609934",
        "urn:oclc:767962275",
        "urn:oclc:780133463",
        "urn:oclc:800216925",
        "urn:oclc:805055648",
        "urn:isbn:0140279512",
        "urn:oclc:271818007",
        "urn:oclc:450713278",
        "urn:oclc:493557543",
        "urn:oclc:728141052",
        "urn:oclc:804802682",
        "urn:oclc:809108593",
        "urn:oclc:813857038",
        "urn:oclc:830910674",
        "urn:oclc:850960474",
        "urn:oclc:853440925",
        "urn:oclc:854957765",
        "urn:oclc:858641779",
        "urn:oclc:488751008",
        "urn:oclc:803612184",
        "urn:isbn:0241958687",
        "urn:oclc:743283528",
        "urn:oclc:759827856",
        "urn:oclc:759858853",
        "urn:oclc:781617758",
        "urn:oclc:784551679",
        "urn:oclc:827719350",
        "urn:oclc:844791752",
        "urn:isbn:1101501960",
        "urn:oclc:748370928",
        "urn:isbn:1101502002",
        "urn:isbn:1429527242",
        "urn:oclc:449219782",
        "urn:isbn:0718998626",
        "urn:isbn:0713992867",
        "urn:lccn:2004057152",
        "urn:oclc:156332857",
        "urn:oclc:443678198",
        "urn:oclc:475417177",
        "urn:oclc:57516751",
        "urn:oclc:611543193",
        "urn:oclc:63139845",
        "urn:oclc:783288542",
        "urn:oclc:803576661",
        "urn:oclc:828597087",
        "urn:oclc:56367771",
        "urn:isbn:1429527277",
        "urn:oclc:506680755",
        "urn:isbn:0713998628",
        "urn:oclc:156799461",
        "urn:oclc:505343443",
        "urn:oclc:566091432",
        "urn:oclc:62542924",
        "urn:isbn:0670033375",
        "urn:oclc:186485402",
        "urn:oclc:255026157",
        "urn:oclc:300800569",
        "urn:oclc:315483245",
        "urn:oclc:441144014",
        "urn:oclc:746873969",
        "urn:oclc:757304316",
        "urn:oclc:760389445",
        "urn:oclc:803897001",
        "urn:oclc:848914750",
        "urn:oclc:879533232",
        "urn:oclc:255838151",
        "urn:oclc:474760948",
        "urn:oclc:493152196",
        "urn:isbn:0739455354",
        "urn:oclc:171289018"
      ],
      "repub_seconds": "223",
      "repub_state": "4",
      "republisher": "scanner-shenzhen-thomas@archive.org",
      "republisher_operator": "scanner-shenzhen-thomas@archive.org",
      "scandate": "20120211022959",
      "scanfee": "100",
      "scanner": "scribe12.shenzhen.archive.org",
      "scanningcenter": "shenzhen",
      "shiptracking": "f0036",
      "sponsor": "Internet Archive",
      "sponsordate": "not to be invoiced-past billing period",
      "subject": [
        "Social history",
        "Social change",
        "Environmental policy",
        "Civilization",
        "Social Conditions",
        "Environment",
        "Culturen",
        "Verval (geschiedenis)",
        "Milieufactoren",
        "Histoire sociale",
        "Changement social",
        "Environnement"
      ],
      "title": "Collapse : how societies choose to fail or succeed",
      "updatedate": "2011-09-14 20:50:56",
      "updater": "tracey.g@archive.org",
      "uploader": "tracey.g@archive.org"
    },
    "number_of_pages": 592,
    "ocaid": "collapse00jare",
    "publish_date": "December 27, 2005",
    "publishers": [
      "Penguin (Non-Classics)"
    ],
    "revision": 11,
    "server": "ia800701.us.archive.org",
    "simplelists": {
      "holdings": {
        "smithsonianlibraries": {
          "notes": [
            {
              "isbn": "9780670033379"
            }
          ],
          "sys_changed_by": {
            "source": "task",
            "task_id": "746449194"
          },
          "sys_last_changed": "2017-09-29 21:35:54.429962"
        },
        "stmaryscountylibrary": {
          "notes": [
            {
              "isbn": "9780670033379"
            }
          ],
          "sys_changed_by": {
            "source": "task",
            "task_id": "747764185"
          },
          "sys_last_changed": "2017-10-02 22:24:33.905071"
        }
      }
    },
    "source_records": [
      "amazon:0143036556:11:2885333153:280883",
      "ia:collapsehowsocie00diam_393"
    ],
    "subtitle": "How Societies Choose to Fail or Succeed",
    "title": "Collapse",
    "type": {
      "key": "/type/edition"
    },
    "uniq": 1637606892,
    "workable_servers": [
      "ia800701.us.archive.org",
      "ia600701.us.archive.org"
    ],
    "works": [
      {
        "key": "/works/OL276557W"
      }
    ],
    "xisbn": {
      "list": [
        {
          "author": "Jared Diamond.",
          "city": "New York, NY [u.a.]",
          "form": [
            "BC"
          ],
          "isbn": [
            "0143036556"
          ],
          "lang": "eng",
          "lccn": [
            "2004057152"
          ],
          "oclcnum": [
            "255838151",
            "441719286",
            "474760948",
            "488751008",
            "493152196",
            "62868295",
            "642543102",
            "670374079",
            "803612184",
            "833419884",
            "841784213",
            "315483245",
            "757304316",
            "803897001",
            "879533232",
            "56367771"
          ],
          "publisher": "Penguin Books",
          "title": "Collapse : how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/255838151?referer=xid"
          ],
          "year": "2006"
        },
        {
          "author": "Jared Diamond.",
          "city": "New York",
          "ed": "Rev. ed.",
          "form": [
            "BC"
          ],
          "isbn": [
            "0143117009"
          ],
          "lang": "eng",
          "lccn": [
            "2011290440"
          ],
          "oclcnum": [
            "688609934",
            "767962275",
            "780133463",
            "800216925",
            "805055648"
          ],
          "publisher": "Penguin Books",
          "title": "Collapse : how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/688609934?referer=xid"
          ],
          "year": "2011"
        },
        {
          "author": "Jared Diamond.",
          "city": "Camberwell, Vic.",
          "form": [
            "BC"
          ],
          "isbn": [
            "0140279512"
          ],
          "lang": "eng",
          "oclcnum": [
            "271818007",
            "450713278",
            "493557543",
            "728141052",
            "804802682",
            "809108593",
            "813857038",
            "830910674",
            "850960474",
            "853440925",
            "854957765",
            "858641779",
            "488751008",
            "803612184"
          ],
          "publisher": "Penguin",
          "title": "Collapse : how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/271818007?referer=xid"
          ],
          "year": "2007"
        },
        {
          "author": "Jared Diamond.",
          "city": "London",
          "ed": "2nd reprinted ed., [with a new afterw.].",
          "form": [
            "BC"
          ],
          "isbn": [
            "0241958687"
          ],
          "lang": "eng",
          "lccn": [
            "2011290440"
          ],
          "oclcnum": [
            "743283528",
            "759827856",
            "759858853",
            "781617758",
            "784551679",
            "827719350",
            "844791752"
          ],
          "publisher": "Penguin",
          "title": "Collapse : how societies choose to fail or survive.",
          "url": [
            "http://www.worldcat.org/oclc/743283528?referer=xid"
          ],
          "year": "2011"
        },
        {
          "author": "Jared Diamond.",
          "city": "New York",
          "form": [
            "BA",
            "DA"
          ],
          "isbn": [
            "1101501960"
          ],
          "lang": "eng",
          "oclcnum": [
            "748370928"
          ],
          "publisher": "Penguin Books",
          "title": "Collapse how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/748370928?referer=xid"
          ],
          "year": "2011"
        },
        {
          "author": "Jared Diamond.",
          "city": "New York",
          "form": [
            "BA",
            "DA"
          ],
          "isbn": [
            "1101502002"
          ],
          "lang": "eng",
          "oclcnum": [
            "748370928"
          ],
          "publisher": "Penguin Books",
          "title": "Collapse how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/748370928?referer=xid"
          ],
          "year": "2011"
        },
        {
          "author": "Jared Diamond.",
          "city": "New York",
          "form": [
            "BA",
            "DA"
          ],
          "isbn": [
            "1429527242"
          ],
          "lang": "eng",
          "oclcnum": [
            "449219782"
          ],
          "publisher": "Penguin",
          "title": "Collapse how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/449219782?referer=xid"
          ],
          "year": "2006"
        },
        {
          "isbn": [
            "0718998626"
          ]
        },
        {
          "author": "Jared Diamond.",
          "city": "London",
          "form": [
            "BA"
          ],
          "isbn": [
            "0713992867"
          ],
          "lang": "eng",
          "lccn": [
            "2004057152"
          ],
          "oclcnum": [
            "156332857",
            "443678198",
            "475417177",
            "57516751",
            "611543193",
            "63139845",
            "783288542",
            "803576661",
            "828597087",
            "56367771"
          ],
          "publisher": "Allen Lane",
          "title": "Collapse : how societies choose to fail or survive",
          "url": [
            "http://www.worldcat.org/oclc/156332857?referer=xid"
          ],
          "year": "2005"
        },
        {
          "author": "Jared Diamond.",
          "city": "Camberwell, Vic.",
          "form": [
            "BA",
            "DA"
          ],
          "isbn": [
            "1429527277"
          ],
          "lang": "eng",
          "oclcnum": [
            "506680755",
            "449219782"
          ],
          "publisher": "Penguin Group",
          "title": "Collapse how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/506680755?referer=xid"
          ],
          "year": "2005"
        },
        {
          "author": "Jared Diamond.",
          "city": "Camberwell, Vic.",
          "form": [
            "BC"
          ],
          "isbn": [
            "0713998628"
          ],
          "lang": "eng",
          "lccn": [
            "2004057152"
          ],
          "oclcnum": [
            "156799461",
            "505343443",
            "566091432",
            "62542924",
            "475417177",
            "57516751",
            "611543193",
            "63139845",
            "783288542",
            "803576661",
            "56367771"
          ],
          "publisher": "Allen Lane",
          "title": "Collapse : how societies choose to fail or survive",
          "url": [
            "http://www.worldcat.org/oclc/156799461?referer=xid"
          ],
          "year": "2005"
        },
        {
          "author": "Jared Diamond.",
          "city": "New York, N.Y.",
          "form": [
            "BB"
          ],
          "isbn": [
            "0670033375"
          ],
          "lang": "eng",
          "lccn": [
            "2004057152"
          ],
          "oclcnum": [
            "186485402",
            "255026157",
            "300800569",
            "315483245",
            "441144014",
            "56367771",
            "746873969",
            "757304316",
            "760389445",
            "803897001",
            "848914750",
            "879533232",
            "255838151",
            "474760948",
            "493152196",
            "63139845"
          ],
          "publisher": "Viking",
          "title": "Collapse : how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/186485402?referer=xid"
          ],
          "year": "2005"
        },
        {
          "author": "Jared Diamond.",
          "city": "New York",
          "form": [
            "BC"
          ],
          "isbn": [
            "0739455354"
          ],
          "lang": "eng",
          "lccn": [
            "2004057152"
          ],
          "oclcnum": [
            "171289018",
            "56367771"
          ],
          "publisher": "Viking",
          "title": "Collapse : how societies choose to fail or succeed",
          "url": [
            "http://www.worldcat.org/oclc/171289018?referer=xid"
          ],
          "year": "2005"
        }
      ],
      "stat": "ok"
    }
  },
  "0816071098": {
    "authors": [
      {
        "key": "/authors/OL2368860A"
      }
    ],
    "authors_metadata": {
      "id": 8839948,
      "key": "/authors/OL2368860A",
      "last_modified": {
        "type": "/type/datetime",
        "value": "2008-09-07 21:38:31.543651"
      },
      "name": "Barbara West",
      "personal_name": "Barbara West",
      "revision": 2,
      "type": {
        "key": "/type/author"
      }
    },
    "created": {
      "type": "/type/datetime",
      "value": "2008-04-30T09:38:13.731961"
    },
    "identifiers": {
      "goodreads": [
        "6262744"
      ],
      "librarything": [
        "8892755"
      ]
    },
    "isbn_10": [
      "0816071098"
    ],
    "isbn_13": [
      "9780816071098"
    ],
    "key": "/books/OL11360683M",
    "languages": [
      {
        "key": "/languages/eng"
      }
    ],
    "last_modified": {
      "type": "/type/datetime",
      "value": "2014-04-06T05:48:52.382888"
    },
    "latest_revision": 10,
    "ocaid": "encyclopediapeop00west",
    "physical_format": "Hardcover",
    "publish_date": "November 30, 2008",
    "publishers": [
      "Facts on File"
    ],
    "revision": 10,
    "source_records": [
      "amazon:0816071098",
      "marc:marc_loc_updates/v36.i04.records.utf8:22758021:711",
      "marc:marc_loc_updates/v36.i05.records.utf8:40342612:741",
      "marc:marc_loc_updates/v37.i35.records.utf8:41225555:840",
      "marc:marc_loc_updates/v38.i04.records.utf8:7006348:1465"
    ],
    "subjects": [
      "Reference",
      "History",
      "History: World"
    ],
    "title": "Encyclopedia of the Peoples of Asia and Oceania",
    "type": {
      "key": "/type/edition"
    },
    "works": [
      {
        "key": "/works/OL7681328W"
      }
    ]
  },
  "0521848296": {
    "authors": [
      {
        "key": "/authors/OL393575A"
      }
    ],
    "authors_metadata": {
      "birth_date": "1954",
      "id": 1074121,
      "key": "/authors/OL393575A",
      "last_modified": {
        "type": "/type/datetime",
        "value": "2008-09-02 14:40:07.531803"
      },
      "name": "Bo Rothstein",
      "personal_name": "Bo Rothstein",
      "revision": 2,
      "type": {
        "key": "/type/author"
      }
    },
    "covers": [
      359279
    ],
    "created": {
      "type": "/type/datetime",
      "value": "2008-04-29T15:03:11.581851"
    },
    "first_sentence": {
      "type": "/type/text",
      "value": "All intellectual journeys have a particular beginning."
    },
    "identifiers": {
      "goodreads": [
        "3224808"
      ]
    },
    "isbn_10": [
      "0521848296"
    ],
    "isbn_13": [
      "9780521848299"
    ],
    "key": "/books/OL7766515M",
    "languages": [
      {
        "key": "/languages/eng"
      }
    ],
    "last_modified": {
      "type": "/type/datetime",
      "value": "2014-07-28T06:47:15.505495"
    },
    "latest_revision": 7,
    "number_of_pages": 256,
    "ocaid": "socialtrapsprobl00roth",
    "physical_dimensions": "9 x 6 x 0.8 inches",
    "physical_format": "Hardcover",
    "publish_date": "November 14, 2005",
    "publishers": [
      "Cambridge University Press"
    ],
    "revision": 7,
    "source_records": [
      "ia:socialtrapsprobl00roth"
    ],
    "subjects": [
      "Sociology, Social Studies",
      "Social capital (Sociology)",
      "Politics / Current Events",
      "Political Science",
      "Politics/International Relations",
      "Social policy",
      "History & Theory - General",
      "Social History",
      "Political Science / History & Theory",
      "Politics - Current Events"
    ],
    "title": "Social Traps and the Problem of Trust (Theories of Institutional Design)",
    "type": {
      "key": "/type/edition"
    },
    "weight": "1.1 pounds",
    "works": [
      {
        "key": "/works/OL2693225W"
      }
    ]
  }
}

describe('getMetadata', () => {
  it('should return a dictionary with specified keys when book is found on the Archive', () => {
    let book = response["0143036556"];
    let result = getMetadata(book);
    expect(result).to.have.keys(['title', 'author', 'image', 'link', 'readable', 'button_class', 'button_text']);
    expect(result['readable']).to.be.true;
  });
  it('should return a dictionary with specified keys when book is not found on the Archive', () => {
    let book = response["0521848296"];
    let result = getMetadata(book);
    expect(result).to.have.keys(['title', 'author', 'image', 'link', 'readable', 'button_class', 'button_text']);
    expect(result['readable']).to.be.false;
    expect(result['link']).to.equal("https://archive.org/donate/");
  });
  it('should return a dictionary with specified keys when book is not found on the Archive, and the image should be undefined', () => {
    let book = response["0816071098"];
    let result = getMetadata(book);
    expect(result).to.have.keys(['title', 'author', 'image', 'link', 'readable', 'button_class', 'button_text']);
    expect(result['readable']).to.be.false;
    expect(result['link']).to.equal("https://archive.org/donate/");
    expect(result['image']).to.be.undefined;
  });
});
