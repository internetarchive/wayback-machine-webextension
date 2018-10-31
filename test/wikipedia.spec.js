const dom = require("./setup").jsdom;
const expect = require("chai").expect;
const getISBNFromCitation = require("../scripts/wikipedia").getISBNFromCitation;
const getIdentifier = require("../scripts/wikipedia").getIdentifier;

describe('getISBNFromCitation', () =>{

  function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
  }
  let html_snippets = [
    {
      "html":'<a href="/wiki/Special:BookSources/9780307787057" title="Special:BookSources/9780307787057">9780307787057</a>',
      "isbn": "9780307787057"
    },
    {
      "html": '<a href="/wiki/Special:BookSources/1-875284-92-3" title="Special:BookSources/1-875284-92-3">1-875284-92-3</a>',
      "isbn" :   "1875284923"
    },
    {
      "html": '<a href="/wiki/Special:BookSources/978-954-9772-76-0" title="Special:BookSources/978-954-9772-76-0">978-954-9772-76-0</a>',
      "isbn": "9789549772760"
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

describe('getIdentifier', ()=>{
  let json = {
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
        111274
      ],
      "created": {
        "type": "/type/datetime",
        "value": "2008-04-29T13:35:46.876380"
      },
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
      "key": "/books/OL7361580M",
      "languages": [
        {
          "key": "/languages/eng"
        }
      ],
      "last_modified": {
        "type": "/type/datetime",
        "value": "2014-07-29T19:59:04.954860"
      },
      "latest_revision": 9,
      "number_of_pages": 592,
      "ocaid": "collapse00jare",
      "publish_date": "December 27, 2005",
      "publishers": [
        "Penguin (Non-Classics)"
      ],
      "revision": 9,
      "source_records": [
        "amazon:0143036556:11:2885333153:280883",
        "ia:collapsehowsocie00diam_393"
      ],
      "subtitle": "How Societies Choose to Fail or Succeed",
      "title": "Collapse",
      "type": {
        "key": "/type/edition"
      },
      "works": [
        {
          "key": "/works/OL276557W"
        }
      ]
    },
    "0198237103": {
      "authors": [
        {
          "key": "/authors/OL2666779A"
        }
      ],
      "authors_metadata": {
        "id": 10075892,
        "key": "/authors/OL2666779A",
        "last_modified": {
          "type": "/type/datetime",
          "value": "2008-04-29 13:35:46.87638"
        },
        "name": "Steven Roger Fischer",
        "revision": 1,
        "type": {
          "key": "/type/author"
        }
      },
      "covers": [
        129662
      ],
      "created": {
        "type": "/type/datetime",
        "value": "2008-04-29T13:35:46.876380"
      },
      "identifiers": {
        "goodreads": [
          "408381"
        ],
        "librarything": [
          "139381"
        ]
      },
      "isbn_10": [
        "0198237103"
      ],
      "isbn_13": [
        "9780198237105"
      ],
      "key": "/books/OL7397972M",
      "languages": [
        {
          "key": "/languages/eng"
        }
      ],
      "last_modified": {
        "type": "/type/datetime",
        "value": "2010-08-05T22:47:43.955516"
      },
      "latest_revision": 6,
      "number_of_pages": 736,
      "publish_date": "February 9, 1998",
      "publishers": [
        "Oxford University Press, USA"
      ],
      "revision": 6,
      "subtitle": "History, Traditions, Text (Oxford Studies in Anthropological Linguistics, 14)",
      "title": "Rongorongo: The Easter Island Script",
      "type": {
        "key": "/type/edition"
      },
      "works": [
        {
          "key": "/works/OL8010114W"
        }
      ]
    },
    "0404142311": {
      "authors": [
        {
          "key": "/authors/OL1803685A"
        }
      ],
      "authors_metadata": {
        "birth_date": "1866",
        "id": 6353901,
        "key": "/authors/OL1803685A",
        "last_modified": {
          "type": "/type/datetime",
          "value": "2008-04-01 03:28:50.625462"
        },
        "name": "Routledge, Scoresby Mrs.",
        "personal_name": "Routledge, Scoresby",
        "revision": 1,
        "title": "Mrs.",
        "type": {
          "key": "/type/author"
        }
      },
      "by_statement": "by Mrs. Scoresby Routledge.",
      "created": {
        "type": "/type/datetime",
        "value": "2008-04-01T03:28:50.625462"
      },
      "dewey_decimal_class": [
        "919.6/18"
      ],
      "identifiers": {
        "goodreads": [
          "3559277"
        ],
        "librarything": [
          "672455"
        ]
      },
      "isbn_10": [
        "0404142311"
      ],
      "key": "/books/OL4550121M",
      "languages": [
        {
          "key": "/languages/eng"
        }
      ],
      "last_modified": {
        "type": "/type/datetime",
        "value": "2011-04-28T10:17:05.995550"
      },
      "latest_revision": 5,
      "lc_classifications": [
        "F3169 .R68 1978"
      ],
      "lccn": [
        "77018690"
      ],
      "notes": {
        "type": "/type/text",
        "value": "Reprint of the 1919 ed. printed for the author by Hazell, Watson and Viney, London.\nIncludes index."
      },
      "number_of_pages": 404,
      "oclc_numbers": [
        "3608936"
      ],
      "pagination": "xxiv, 404 p., [67] leaves of plates :",
      "publish_country": "nyu",
      "publish_date": "1978",
      "publish_places": [
        "New York"
      ],
      "publishers": [
        "AMS Press"
      ],
      "revision": 5,
      "subject_place": [
        "Easter Island."
      ],
      "subjects": [
        "Routledge, Scoresby, Mrs., b. 1866.",
        "Voyages and travels.",
        "Easter Island."
      ],
      "subtitle": "the story of an expedition",
      "title": "The mystery of Easter Island",
      "type": {
        "key": "/type/edition"
      },
      "works": [
        {
          "key": "/works/OL6674088W"
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
    },
    "0714125040": {
      "authors": [
        {
          "key": "/authors/OL3578521A"
        }
      ],
      "authors_metadata": {
        "id": 14849824,
        "key": "/authors/OL3578521A",
        "last_modified": {
          "type": "/type/datetime",
          "value": "2008-04-30 09:38:13.731961"
        },
        "name": "Jo Anne Van. Tilburg",
        "revision": 1,
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
          "408382"
        ],
        "librarything": [
          "4632287"
        ]
      },
      "isbn_10": [
        "0714125040"
      ],
      "isbn_13": [
        "9780714125046"
      ],
      "key": "/books/OL11251188M",
      "last_modified": {
        "type": "/type/datetime",
        "value": "2010-08-17T06:37:40.523883"
      },
      "latest_revision": 5,
      "number_of_pages": 232,
      "physical_format": "Hardcover",
      "publish_date": "1994",
      "publishers": [
        "British Museum"
      ],
      "revision": 5,
      "subtitle": "ARCHAEOLOGY, ECOLOGY AND CULTURE.",
      "title": "EASTER ISLAND",
      "type": {
        "key": "/type/edition"
      },
      "works": [
        {
          "key": "/works/OL9578249W"
        }
      ]
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
    "0917956745": {
      "authors": [
        {
          "key": "/authors/OL233246A"
        }
      ],
      "authors_metadata": {
        "birth_date": "1926",
        "id": 606816,
        "key": "/authors/OL233246A",
        "last_modified": {
          "type": "/type/datetime",
          "value": "2008-09-07 07:13:45.053651"
        },
        "name": "Georgia Lee",
        "personal_name": "Georgia Lee",
        "revision": 2,
        "type": {
          "key": "/type/author"
        }
      },
      "by_statement": "Georgia Lee.",
      "covers": [
        3975152
      ],
      "created": {
        "type": "/type/datetime",
        "value": "2008-04-01T03:28:50.625462"
      },
      "dewey_decimal_class": [
        "709/.01/13099618"
      ],
      "identifiers": {
        "goodreads": [
          "3005691"
        ],
        "librarything": [
          "742967"
        ]
      },
      "isbn_10": [
        "0917956745"
      ],
      "key": "/books/OL1565252M",
      "languages": [
        {
          "key": "/languages/eng"
        }
      ],
      "last_modified": {
        "type": "/type/datetime",
        "value": "2010-07-31T04:27:21.941287"
      },
      "latest_revision": 5,
      "lc_classifications": [
        "GN875.E17 L44 1992"
      ],
      "lccn": [
        "91047034"
      ],
      "notes": {
        "type": "/type/text",
        "value": "Includes bibliographical references (p. [213]-222) and index."
      },
      "number_of_pages": 225,
      "pagination": "xiii, 225 p. :",
      "publish_country": "cau",
      "publish_date": "1992",
      "publish_places": [
        "Los Angeles, Calif"
      ],
      "publishers": [
        "Institute of Archaeology, University of California, Los Angeles"
      ],
      "revision": 5,
      "series": [
        "Monumenta archaeologica ;",
        "v. 17",
        "Monumenta archaeologica (University of California, Los Angeles. Institute of Archaeology) ;",
        "v. 17."
      ],
      "subject_place": [
        "Easter Island",
        "Easter Island."
      ],
      "subjects": [
        "Petroglyphs -- Easter Island.",
        "Rock paintings -- Easter Island.",
        "Polynesians -- Antiquities.",
        "Easter Island -- Antiquities."
      ],
      "subtitle": "symbols of power, prayers to the gods",
      "title": "Rock art of Easter Island",
      "type": {
        "key": "/type/edition"
      },
      "works": [
        {
          "key": "/works/OL1943483W"
        }
      ]
    },
    "9780306474941": {
      "contributions": [
        "John Loret (Editor)",
        "John T. Tanacredi (Editor)"
      ],
      "covers": [
        1164594
      ],
      "created": {
        "type": "/type/datetime",
        "value": "2008-04-30T09:38:13.731961"
      },
      "edition_name": "1 edition",
      "first_sentence": {
        "type": "/type/text",
        "value": "In the fall of 1954 as a graduate student at the University of Oslo, Norway."
      },
      "id": 12673571,
      "identifiers": {
        "goodreads": [
          "1231784"
        ]
      },
      "isbn_10": [
        "0306474948"
      ],
      "isbn_13": [
        "9780306474941"
      ],
      "key": "/books/OL9402898M",
      "languages": [
        {
          "key": "/languages/eng"
        }
      ],
      "last_modified": {
        "type": "/type/datetime",
        "value": "2010-04-24T17:35:14.800115"
      },
      "latest_revision": 5,
      "number_of_pages": 240,
      "physical_dimensions": "9.1 x 5.9 x 0.8 inches",
      "physical_format": "Hardcover",
      "publish_date": "August 31, 2003",
      "publishers": [
        "Springer"
      ],
      "revision": 5,
      "source_records": [
        "amazon:0306474948:2-af:745682157:222225",
        "marc:marc_loc_updates/v36.i10.records.utf8:18266365:1270"
      ],
      "subjects": [
        "Pollution & threats to the environment",
        "Nature",
        "Environmental Studies",
        "Nature/Ecology",
        "Earth Sciences - Oceanography",
        "Environmental Conservation & Protection - General",
        "Environmental Science",
        "Science / Environmental Science",
        "Lakes & Ponds",
        "Easter Island",
        "Environmental management",
        "Environmental protection",
        "Marine biology",
        "Oceanography"
      ],
      "subtitle": "Scientific Exploration into the World's Environmental Problems in Microcosm",
      "title": "Easter Island",
      "type": {
        "key": "/type/edition"
      },
      "weight": "1.3 pounds"
    },
    "9780307787057": {
      "classifications": {},
      "covers": [
        8065907
      ],
      "created": 1539968137,
      "d1": "ia902507.us.archive.org",
      "d2": "ia802507.us.archive.org",
      "dir": "/26/items/easterislandisla00dosp",
      "files": [
        {
          "crc32": "ba57c6ca",
          "format": "JPEG Thumb",
          "md5": "5bb816f2b0aa31da394616fb52c19f44",
          "mtime": "1533010440",
          "name": "__ia_thumb.jpg",
          "private": "true",
          "rotation": "0",
          "sha1": "806a8eb8f5e727cda3f1313c328e261479f82d12",
          "size": "19364",
          "source": "original"
        },
        {
          "crc32": "750ae934",
          "format": "Backup",
          "md5": "2108911195d09f2df4505fbb39361b6f",
          "mtime": "1505593772",
          "name": "bak/2017/easterislandisla00dosp_meta.sqlite.bak",
          "private": "true",
          "sha1": "6db5a794e608799d4b6c28d637f4998d95f78046",
          "size": "11264",
          "source": "original"
        },
        {
          "crc32": "5dbd308a",
          "format": "Text PDF",
          "md5": "d624adc73ea08a756728a1ea1e2c6db6",
          "mtime": "1505707394",
          "name": "easterislandisla00dosp.pdf",
          "original": "easterislandisla00dosp_djvu.xml",
          "private": "true",
          "sha1": "6008ff2b69f3f3eef78fb6a219ca48fcbdaf4ccf",
          "size": "31289405",
          "source": "derivative"
        },
        {
          "crc32": "f73faddb",
          "format": "Abbyy GZ",
          "md5": "77a61f1e814b58a01803557d5b84b1f2",
          "mtime": "1505706296",
          "name": "easterislandisla00dosp_abbyy.gz",
          "original": "easterislandisla00dosp_jp2.zip",
          "private": "true",
          "sha1": "668721c67ad282b7eed15305d3756869d641351e",
          "size": "5380548",
          "source": "derivative"
        },
        {
          "crc32": "4a7a2725",
          "format": "Dublin Core",
          "md5": "ca9a1e3e95e6a1e12342ffebdb05e058",
          "mtime": "1401397142",
          "name": "easterislandisla00dosp_dc.xml",
          "sha1": "cd70870a98f279f25f4ae17ed5d48192fe73ebff",
          "size": "672",
          "source": "original"
        },
        {
          "crc32": "007cffd2",
          "format": "DjVuTXT",
          "md5": "c2cb2fe9b703cf5d6ab8247dd9cb7b36",
          "mtime": "1505707398",
          "name": "easterislandisla00dosp_djvu.txt",
          "original": "easterislandisla00dosp_djvu.xml",
          "private": "true",
          "sha1": "02588d3833fa4e1b33d3a3d399e8066ec3b3eefc",
          "size": "354888",
          "source": "derivative"
        },
        {
          "crc32": "2d20bd77",
          "format": "Djvu XML",
          "md5": "3772fb05deae59e39ab10400ee4186b5",
          "mtime": "1505706378",
          "name": "easterislandisla00dosp_djvu.xml",
          "original": "easterislandisla00dosp_abbyy.gz",
          "private": "true",
          "sha1": "0f4e793323ea68ea8a0630e806fb6fd6c1f44b26",
          "size": "3428420",
          "source": "derivative"
        },
        {
          "crc32": "f38e14d2",
          "format": "ACS Encrypted EPUB",
          "md5": "f7d689da4fdc304a0e85c38b2012551b",
          "mtime": "1509041863",
          "name": "easterislandisla00dosp_encrypted.epub",
          "original": "easterislandisla00dosp_jpg.pdf",
          "sha1": "1728369b825642b106de04744f203b3c669b5e14",
          "size": "2648953",
          "source": "derivative"
        },
        {
          "crc32": "efc48fe6",
          "format": "ACS Encrypted PDF",
          "md5": "710c1315a5e50d8eeaa7464ca2578c22",
          "mtime": "1509041745",
          "name": "easterislandisla00dosp_encrypted.pdf",
          "original": "easterislandisla00dosp_jpg.pdf",
          "sha1": "3de3666ca38297e123c725ffc789e54283e9641d",
          "size": "58938031",
          "source": "derivative"
        },
        {
          "crc32": "0ce581f9",
          "format": "JSON",
          "md5": "d650b53944cb2664b7b074d6c2e8cf15",
          "mtime": "1505701960",
          "name": "easterislandisla00dosp_events.json",
          "private": "true",
          "sha1": "4561898815d226f2df195cd04de6c4b05aee14f1",
          "size": "53",
          "source": "original"
        },
        {
          "format": "Metadata",
          "md5": "ba4704ae87b92e3ce74aa03932027e9b",
          "name": "easterislandisla00dosp_files.xml",
          "source": "original"
        },
        {
          "crc32": "8bf13b2d",
          "format": "Single Page Processed JP2 ZIP",
          "md5": "bf6bed2bf03ae02536c15c8124aa5af1",
          "mtime": "1505704660",
          "name": "easterislandisla00dosp_jp2.zip",
          "original": "easterislandisla00dosp_orig_jp2.tar",
          "private": "true",
          "sha1": "13ff3a6f044a1b066f87a253d0ea6d54d93260b1",
          "size": "234469981",
          "source": "derivative"
        },
        {
          "crc32": "efd19e05",
          "format": "JPEG-Compressed PDF",
          "md5": "f36b805ff6af91a65e08a0d857747499",
          "mtime": "1509041732",
          "name": "easterislandisla00dosp_jpg.pdf",
          "original": "easterislandisla00dosp_abbyy.gz",
          "private": "true",
          "sha1": "f70345be1f27147ab50a7f1e442d071cef42bbdf",
          "size": "58943767",
          "source": "derivative"
        },
        {
          "crc32": "231d3cd9",
          "format": "JSON",
          "md5": "322fb310297b8239201da771bb8240b7",
          "mtime": "1538696424",
          "name": "easterislandisla00dosp_loans.json",
          "private": "true",
          "sha1": "ad6eaa14700b1db76a41f53a425c787f56ee4dab",
          "size": "5011",
          "source": "original"
        },
        {
          "crc32": "65319619",
          "format": "MARC",
          "md5": "eb54424346330463ff961e1dba69b2bd",
          "mtime": "1401397142",
          "name": "easterislandisla00dosp_marc.xml",
          "sha1": "5ef2d09180c9d4978e8b51133ac22a6eff8b0a26",
          "size": "2269",
          "source": "original"
        },
        {
          "crc32": "1e36213e",
          "format": "MARC Binary",
          "md5": "4ec06b2131ee9ca96f56fd3587cf534e",
          "mtime": "1401397142",
          "name": "easterislandisla00dosp_meta.mrc",
          "sha1": "e657450af1ded8b07273389fab9e307361b15f28",
          "size": "633",
          "source": "original"
        },
        {
          "crc32": "0f566d78",
          "format": "Metadata",
          "md5": "6f1d246d33d6cbc2774cfe8067fad427",
          "mtime": "1505702019",
          "name": "easterislandisla00dosp_meta.sqlite",
          "sha1": "c4f5c8ddb57fb42e51c5a5a426a5dabc906ac853",
          "size": "13312",
          "source": "original"
        },
        {
          "crc32": "287471a0",
          "format": "Metadata",
          "md5": "02c00452ed68d5cd30e6a1e0b3e33818",
          "mtime": "1538696424",
          "name": "easterislandisla00dosp_meta.xml",
          "sha1": "fbf4b0fe9c2020e29b184b4db7d7da83c3b39a53",
          "size": "3011",
          "source": "original"
        },
        {
          "crc32": "ce0ae659",
          "format": "MARC Source",
          "md5": "9b8b269865e76817fdfd695f85a34075",
          "mtime": "1401397142",
          "name": "easterislandisla00dosp_metasource.xml",
          "sha1": "07e2a8cc4d38c6c3395cc45287442e47b281fada",
          "size": "290",
          "source": "original"
        },
        {
          "crc32": "88f3a5f8",
          "format": "Single Page Original JP2 Tar",
          "md5": "ef09f5693fc8c9b8e95b3b7948bad980",
          "mtime": "1505702018",
          "name": "easterislandisla00dosp_orig_jp2.tar",
          "private": "true",
          "sha1": "e9e726dfbc2bb8eef9ff59b1adc6ee37f1900573",
          "size": "641689600",
          "source": "original"
        },
        {
          "crc32": "86f68e08",
          "format": "Scandata",
          "md5": "41bb04823d2af91f567fe92da75bb33f",
          "mtime": "1505702018",
          "name": "easterislandisla00dosp_scandata.xml",
          "sha1": "8c846b7feddea85fb55dd3e359d59fdead4a86f0",
          "size": "364221",
          "source": "original"
        },
        {
          "crc32": "fdb88443",
          "format": "Log",
          "md5": "930a22a60a29fda2a0af57c063a3497b",
          "mtime": "1505593767",
          "name": "logs/easterislandisla00dosp_iabdash_2017-09-17042919.log",
          "private": "true",
          "sha1": "a4ada8794824523ce3eff6a8fb69f07de54a6d12",
          "size": "354",
          "source": "original"
        },
        {
          "crc32": "6604519d",
          "format": "Log",
          "md5": "370955bc23bd9bb61a2d79f2bee29d2c",
          "mtime": "1505593761",
          "name": "logs/easterislandisla00dosp_scanning_2017-09-17042914.log",
          "private": "true",
          "sha1": "eada229896bbb0a846a1be2640da0daccbe713af",
          "size": "259864",
          "source": "original"
        }
      ],
      "files_count": 23,
      "identifiers": {},
      "isbn_13": [
        "9780307787057"
      ],
      "item_size": 1037823911,
      "key": "/books/OL26376031M",
      "last_modified": {
        "type": "/type/datetime",
        "value": "2018-09-07T00:21:00.102363"
      },
      "latest_revision": 2,
      "metadata": {
        "addeddate": "2014-05-29 20:59:05.312809",
        "backup_location": "ia905808_13",
        "bookplateleaf": "0005",
        "boxid": "IA1156919",
        "collection": [
          "inlibrary",
          "printdisabled",
          "internetarchivebooks",
          "china"
        ],
        "contributor": "Internet Archive",
        "creator": "Dos Passos, John, 1896-1970. cn",
        "date": "1971",
        "donor": "bostonpubliclibrary",
        "external-identifier": [
          "acs:epub:urn:uuid:516b4c5b-9972-4b29-ae5f-72f3ba7875d0",
          "acs:pdf:urn:uuid:1c00c1b1-4878-46f0-9123-af812d6c77c7",
          "urn:acs6:easterislandisla00dosp:pdf:c428897e-1d3f-4792-885e-251d4652add8",
          "urn:acs6:easterislandisla00dosp:epub:315a1bd2-d8d5-4195-b01f-1876f89dc35d",
          "urn:oclc:record:1033566464"
        ],
        "foldoutcount": "0",
        "identifier": "easterislandisla00dosp",
        "identifier-access": "http://archive.org/details/easterislandisla00dosp",
        "identifier-ark": "ark:/13960/t4rk0nx4g",
        "imagecount": "226",
        "invoice": "1213",
        "isbn": "9780307787057",
        "language": "eng",
        "lccn": [
          "78111160",
          "78111160 //r85"
        ],
        "loans__status__last_loan_date": "2018-09-17T19:45:14Z",
        "loans__status__num_loans": "0",
        "loans__status__num_waitlist": "0",
        "loans__status__status": "AVAILABLE",
        "mediatype": "texts",
        "ocr": "ABBYY FineReader 11.0",
        "openlibrary": "OL4763972M",
        "openlibrary_edition": "OL26376031M",
        "openlibrary_work": "OL17786682W",
        "operator": "associate-bizhong-hu@archive.org",
        "page-progression": "lr",
        "ppi": "300",
        "publicdate": "2014-05-29 20:59:08",
        "publisher": "Garden City, N.Y., Doubleday",
        "repub_state": "4",
        "republisher_date": "20170918103126",
        "republisher_operator": "republisher7.shenzhen@archive.org",
        "republisher_time": "508",
        "scandate": "20170916213607",
        "scanfee": "15",
        "scanner": "ttscribe16.hongkong.archive.org",
        "scanningcenter": "hongkong",
        "shipping_container": "SZ0025",
        "shiptracking": "F0265",
        "sponsor": "Kahle/Austin Foundation",
        "sponsordate": "20170930",
        "subject": "Easter Island",
        "title": "Easter Island; island of enigmas",
        "tts_version": "v1.52-initial-114-g3ffc1a2",
        "updatedate": "2014-05-29 20:58:52",
        "updater": "associate-tracey-gutierres@archive.org",
        "uploader": "associate-tracey-gutierres@archive.org",
        "year": "1971"
      },
      "ocaid": "easterislandisla00dosp",
      "openlibrary": "/books/OL4763972M",
      "publish_date": "1971",
      "publish_places": [
        "Garden City, New York, USA"
      ],
      "publishers": [
        "Doubleday"
      ],
      "revision": 2,
      "server": "ia902507.us.archive.org",
      "source_records": [
        "ia:easterislandisla00dosp"
      ],
      "title": "Easter Island; island of enigmas",
      "type": {
        "key": "/type/edition"
      },
      "uniq": 1995242324,
      "workable_servers": [
        "ia902507.us.archive.org",
        "ia802507.us.archive.org"
      ],
      "works": [
        {
          "key": "/works/OL17786682W"
        }
      ]
    },
    "9780520261143": {
      "authors": [
        {
          "key": "/authors/OL268591A"
        }
      ],
      "authors_metadata": {
        "id": 705231,
        "key": "/authors/OL268591A",
        "last_modified": {
          "type": "/type/datetime",
          "value": "2008-09-04 09:03:49.405544"
        },
        "name": "Anne Salmond",
        "personal_name": "Anne Salmond",
        "revision": 2,
        "type": {
          "key": "/type/author"
        }
      },
      "by_statement": "Anne Salmond",
      "created": {
        "type": "/type/datetime",
        "value": "2011-01-06T19:47:06.407827"
      },
      "dewey_decimal_class": [
        "996.211"
      ],
      "edition_name": "1st University of California Press ed.",
      "isbn_10": [
        "0520261143"
      ],
      "isbn_13": [
        "9780520261143"
      ],
      "key": "/books/OL24573773M",
      "languages": [
        {
          "key": "/languages/eng"
        }
      ],
      "last_modified": {
        "type": "/type/datetime",
        "value": "2011-01-06T19:47:06.407827"
      },
      "latest_revision": 1,
      "lc_classifications": [
        "DU870 .S335 2010"
      ],
      "lccn": [
        "2009024503"
      ],
      "notes": {
        "type": "/type/text",
        "value": "Originally published: Auckland, N.Z. : Viking, 2009.\n\nIncludes bibliographical references (p. [470]-517) and index."
      },
      "number_of_pages": 537,
      "oclc_numbers": [
        "317461764"
      ],
      "pagination": "537 p., [8] p. of plates :",
      "publish_country": "cau",
      "publish_date": "2010",
      "publish_places": [
        "Berkeley, Calif"
      ],
      "publishers": [
        "University of California Press"
      ],
      "revision": 1,
      "source_records": [
        "marc:marc_loc_updates/v38.i15.records.utf8:9528978:2048"
      ],
      "subtitle": "the European discovery of Tahiti",
      "table_of_contents": [
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Aphrodite's island"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Thunder in 'Opoa"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "The glorious children of Tetumu"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Purea, 'Queen' of Tahiti"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Happy island of Cythera"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Ahutoru at the opéra"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "A Polynesian Venus"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Captain Cook in Arcadia"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "The transit of Venus"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Circling the land"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Tupaia's ship"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "The Viceroy of Peru"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Tute's return"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Hitihiti's odyssey"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "The red feathers of 'Oro"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Three Tahitians in Lima"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Boenechea's burial"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Matimo and the friars"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Ma'i on ice skates"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "A bare-chested captain"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Tute's portThe angel of history"
        },
        {
          "label": "",
          "level": 0,
          "pagenum": "",
          "title": "Appendix. The seasons in Tahiti."
        }
      ],
      "title": "Aphrodite's island",
      "type": {
        "key": "/type/edition"
      },
      "works": [
        {
          "key": "/works/OL15625572W"
        }
      ]
    },
    "9781861892829": {
      "authors": [
        {
          "key": "/authors/OL2666779A"
        }
      ],
      "authors_metadata": {
        "id": 10075892,
        "key": "/authors/OL2666779A",
        "last_modified": {
          "type": "/type/datetime",
          "value": "2008-04-29 13:35:46.87638"
        },
        "name": "Steven Roger Fischer",
        "revision": 1,
        "type": {
          "key": "/type/author"
        }
      },
      "covers": [
        917605
      ],
      "created": {
        "type": "/type/datetime",
        "value": "2008-04-30T08:14:56.482104"
      },
      "edition_name": "1 edition",
      "identifiers": {
        "goodreads": [
          "99739"
        ],
        "librarything": [
          "145483"
        ]
      },
      "isbn_10": [
        "1861892829"
      ],
      "isbn_13": [
        "9781861892829"
      ],
      "key": "/books/OL8631457M",
      "languages": [
        {
          "key": "/languages/eng"
        }
      ],
      "last_modified": {
        "type": "/type/datetime",
        "value": "2010-08-10T06:19:33.057692"
      },
      "latest_revision": 6,
      "number_of_pages": 304,
      "physical_dimensions": "8.4 x 5.4 x 1 inches",
      "physical_format": "Paperback",
      "publish_date": "June 1, 2006",
      "publishers": [
        "Reaktion Books"
      ],
      "revision": 6,
      "subjects": [
        "Australasian & Pacific history",
        "History: World",
        "History",
        "History - General History",
        "Easter Island",
        "Oceania",
        "History / Civilization",
        "Civilization",
        "Description and travel"
      ],
      "subtitle": "The Turbulent History of Easter Island",
      "title": "Island at the End of the World",
      "type": {
        "key": "/type/edition"
      },
      "weight": "9.9 ounces",
      "works": [
        {
          "key": "/works/OL8010117W"
        }
      ]
    }
  };
  it('should return the archive identifier if it can be found in the json', ()=>{
    let result1 = getIdentifier(json["9780307787057"]);
    expect(result1).to.equal("easterislandisla00dosp");
    let result2 = getIdentifier(json["0143036556"]);
    expect(result2).to.equal("collapse00jare");
  });
  it('should return null when no identifier is found', ()=>{
    let result = getIdentifier(json["0198237103"]);
    expect(result).to.be.null;
  });
});
