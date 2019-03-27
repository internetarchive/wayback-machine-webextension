const dom = require("./setup").jsdom;
const expect = require("chai").expect;
const getMetadata = require("../scripts/wikipedia").getMetadata;

const response = {
  "9780143036555": {
    "created": 1553722066,
    "d1": "ia902905.us.archive.org",
    "d2": "ia802905.us.archive.org",
    "dir": "/21/items/collapse00jare",
    "files": [
        {
            "crc32": "e7e1a275",
            "format": "JPEG Thumb",
            "md5": "84900783b1ad797ead5ed8aaec1e3f39",
            "mtime": "1540386874",
            "name": "__ia_thumb.jpg",
            "private": "true",
            "rotation": "0",
            "sha1": "a731dc4ea2adb5425cdef2d48efa21e9fbc81f09",
            "size": "21424",
            "source": "original"
        },
        {
            "crc32": "b9e4ac82",
            "format": "DjVu",
            "md5": "f5701f5866d0db99e66e86dfc7ad2090",
            "mtime": "1328947717",
            "name": "collapse00jare.djvu",
            "original": "collapse00jare_djvu.xml",
            "private": "true",
            "sha1": "edf421050dc17cc6290aeac98ba911ac5db8b2e4",
            "size": "17123938",
            "source": "derivative"
        },
        {
            "crc32": "ee5cd1ca",
            "format": "Animated GIF",
            "md5": "0cbe203ed75e4f85e29c1f2441b48193",
            "mtime": "1328939087",
            "name": "collapse00jare.gif",
            "original": "collapse00jare_jp2.zip",
            "sha1": "c3162a9e3074379193f44e890c6709dc5fb0a895",
            "size": "278177",
            "source": "derivative"
        },
        {
            "crc32": "8b0e82ec",
            "format": "Text PDF",
            "md5": "f57665c49a8e3f4dbce7d34ac24b52b2",
            "mtime": "1328957069",
            "name": "collapse00jare.pdf",
            "original": "collapse00jare_djvu.xml",
            "private": "true",
            "sha1": "9b308c4a5d57fe9c6b00ec9bb74d5e3e367f0280",
            "size": "38059523",
            "source": "derivative"
        },
        {
            "crc32": "0626937e",
            "format": "Abbyy GZ",
            "md5": "4fb8b43ccf6c265b4c0a413e00133a1e",
            "mtime": "1328944108",
            "name": "collapse00jare_abbyy.gz",
            "original": "collapse00jare_jp2.zip",
            "private": "true",
            "sha1": "067ed4ff4f9d60f2d54d7bdece10cc23fd271609",
            "size": "22319505",
            "source": "derivative"
        },
        {
            "crc32": "12ac5ac9",
            "format": "Dublin Core",
            "md5": "9fdaa5950a762991a86b8b96c9d43484",
            "mtime": "1454277521",
            "name": "collapse00jare_dc.xml",
            "sha1": "f6c5a9e94224544eec0a137ece5f0f8870bab7cb",
            "size": "6411",
            "source": "original"
        },
        {
            "crc32": "2f9141b2",
            "format": "DjVuTXT",
            "md5": "b0a905d7d8d54e58a9c29e48e43cfd21",
            "mtime": "1328957108",
            "name": "collapse00jare_djvu.txt",
            "original": "collapse00jare.djvu",
            "private": "true",
            "sha1": "cd2f71a48630d01b567147e0207d14ce10d51d00",
            "size": "1563790",
            "source": "derivative"
        },
        {
            "crc32": "67852e37",
            "format": "Djvu XML",
            "md5": "d3a0b259a8ead444130d45ce168e6957",
            "mtime": "1328944564",
            "name": "collapse00jare_djvu.xml",
            "original": "collapse00jare_abbyy.gz",
            "private": "true",
            "sha1": "57ee6615ce5e1bf9a27400b6cd5dc388ad65e01a",
            "size": "13612955",
            "source": "derivative"
        },
        {
            "crc32": "86cc4ebe",
            "format": "ACS Encrypted EPUB",
            "md5": "5ca6e50e9de678b1366f988a27102715",
            "mtime": "1530188860",
            "name": "collapse00jare_encrypted.epub",
            "original": "collapse00jare_abbyy.gz",
            "sha1": "16f75a48b163cc6073c2c57281d4d4e9ca3233aa",
            "size": "20118733",
            "source": "derivative"
        },
        {
            "crc32": "af7029f5",
            "format": "ACS Encrypted PDF",
            "md5": "da89da82817c39e7d2cc2d69d423253e",
            "mtime": "1530188726",
            "name": "collapse00jare_encrypted.pdf",
            "original": "collapse00jare.pdf",
            "sha1": "5f874ac1942442f169df6b5b7ca2280a088b7f64",
            "size": "38059796",
            "source": "derivative"
        },
        {
            "crc32": "4fb04511",
            "format": "Metadata",
            "md5": "f3ad0321f53f184a530d6eabd7a4376f",
            "mtime": "1419899214",
            "name": "collapse00jare_extramarc.xml",
            "sha1": "cc770f86b60dcb5be15c500bd1dd9651bc4cd93d",
            "size": "8512",
            "source": "original"
        },
        {
            "format": "Metadata",
            "md5": "a49201bec0178be5a99a505455178e96",
            "name": "collapse00jare_files.xml",
            "source": "original"
        },
        {
            "crc32": "5519b367",
            "format": "Single Page Processed JP2 ZIP",
            "md5": "12fb0af8a4495db9870f1cfed0d41135",
            "mtime": "1328939035",
            "name": "collapse00jare_jp2.zip",
            "original": "collapse00jare_orig_jp2.tar",
            "private": "true",
            "sha1": "665ce61ad94b8ae778b642910b28cc28cb54f3d0",
            "size": "342212457",
            "source": "derivative"
        },
        {
            "crc32": "be845c8a",
            "format": "JPEG-Compressed PDF",
            "md5": "2ad09dfb0a628d1b44833f6dc6cebb0d",
            "mtime": "1328952270",
            "name": "collapse00jare_jpg.pdf",
            "original": "collapse00jare_djvu.xml",
            "private": "true",
            "sha1": "eaa0ce0c67411a82d32218ffb8de13d065c207c9",
            "size": "92789932",
            "source": "derivative"
        },
        {
            "crc32": "781019c4",
            "format": "JSON",
            "md5": "08065232925ea3f5ba979a0a7638690a",
            "mtime": "1552109999",
            "name": "collapse00jare_loans.json",
            "private": "true",
            "sha1": "ac98e96a99b97b1849972d6249e01c0e5af5c06c",
            "size": "4883",
            "source": "original"
        },
        {
            "crc32": "d9b28820",
            "format": "MARC",
            "md5": "f7d26b74cd2cf97780a9e7c885a7a215",
            "mtime": "1454277521",
            "name": "collapse00jare_marc.xml",
            "sha1": "a78d28a26d830e4c1fa909ec7d9e0b585163bffa",
            "size": "10690",
            "source": "original"
        },
        {
            "crc32": "df25bcfe",
            "format": "Metadata Log",
            "md5": "7c5ba65c48607130b5fc9b9874d60195",
            "mtime": "1454277523",
            "name": "collapse00jare_meta.log",
            "original": "collapse00jare_xisbn.json",
            "private": "true",
            "sha1": "da5ab680ec27260c5897d9a55bed3a4281c4f23b",
            "size": "3616",
            "source": "derivative"
        },
        {
            "crc32": "664f7776",
            "format": "MARC Binary",
            "md5": "ba10c12cf28091d7b0e473872b80e2e7",
            "mtime": "1454277521",
            "name": "collapse00jare_meta.mrc",
            "sha1": "42988b83aa43b62efe9c1711d1067fa4b05561f5",
            "size": "6369",
            "source": "original"
        },
        {
            "crc32": "89058ecd",
            "format": "Metadata",
            "md5": "9d0a3fc3a8bba19415eb9efb77b05e2a",
            "mtime": "1470247083",
            "name": "collapse00jare_meta.sqlite",
            "sha1": "00233c54f97886abfa7bfa7a9544f5d289ac4f58",
            "size": "8192",
            "source": "original"
        },
        {
            "crc32": "a3e36646",
            "format": "Metadata",
            "md5": "ebb3d8b4cad8698beb95415cc5cb2be4",
            "mtime": "1552109999",
            "name": "collapse00jare_meta.xml",
            "sha1": "ccad20433ccefaac5b89b993de0ee5b69b5055e3",
            "size": "13399",
            "source": "original"
        },
        {
            "crc32": "8e63f94b",
            "format": "MARC Source",
            "md5": "bca6499dd983179c300f7224dd57b340",
            "mtime": "1316033468",
            "name": "collapse00jare_metasource.xml",
            "sha1": "0683d161e6a26fc694cd44fdff2abe3673718822",
            "size": "272",
            "source": "original"
        },
        {
            "crc32": "3970f92e",
            "format": "METS",
            "md5": "67687935f1fa10b47eb00b9d7c97cefe",
            "mtime": "1439362376",
            "name": "collapse00jare_mets.xml",
            "private": "true",
            "sha1": "5232c4502e17419ea420e81ee8559b744ff22549",
            "size": "4943",
            "source": "original"
        },
        {
            "crc32": "974d82f0",
            "format": "Single Page Original JP2 Tar",
            "md5": "f23b18e07dc103bcab8da4b8a3effcce",
            "mtime": "1328927444",
            "name": "collapse00jare_orig_jp2.tar",
            "private": "true",
            "sha1": "8e38a7201565f6440e20d956f9c8aa8f754e9de3",
            "size": "453335040",
            "source": "original"
        },
        {
            "crc32": "694ae716",
            "format": "Scandata",
            "md5": "d68637f1ccce3fc7dd9097313a833ec3",
            "mtime": "1328927399",
            "name": "collapse00jare_scandata.xml",
            "sha1": "e553a7e2292b83ce0d5fe491abfd61ba69f450e2",
            "size": "734610",
            "source": "original"
        },
        {
            "crc32": "18a61df8",
            "format": "Contents",
            "md5": "9849a7545e069e60d7fc4e503c8f7367",
            "mtime": "1328947719",
            "name": "collapse00jare_toc.xml",
            "original": "collapse00jare_djvu.xml",
            "private": "true",
            "sha1": "b8675c00bd7d90d0fe5d223e5cd9e398dc3cdb61",
            "size": "19358",
            "source": "derivative"
        },
        {
            "crc32": "1eb41a41",
            "format": "OCLC xISBN JSON",
            "md5": "d072ebde5b0584d8fd8d70ac32ee5aba",
            "mtime": "1454160288",
            "name": "collapse00jare_xisbn.json",
            "sha1": "2a920c37c0f778c2b9c98cfaf777522840c1feb7",
            "size": "4596",
            "source": "original"
        }
    ],
    "files_count": 26,
    "item_size": 1040321121,
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
        "description": [
            "Includes bibliographical references (p. [529]-560) and index",
            "Prologue : a tale of two farms -- Two farms -- Collapses, past and present -- Vanished Edens? -- A five-point framework -- Businesses and the environment -- The comparative method -- Plan of the book -- pt. 1. Modern Montana -- 1. Under Montana's big sky -- Stan Falkow's story -- Montana and me -- Why begin with Montana? -- Montana's economic history -- Mining -- Forests -- Soil -- Water -- Native and non-native species -- Differing visions -- Attitudes towards regulation -- Rick Laible's story -- Chip Pigman's story -- Tim Huls's story -- John Cook's story -- Montana, model of the world --",
            "pt. 2. Past societies -- 2. Twilight at Easter -- The quarry's mysteries -- Easter's geography and history -- People and food -- Chiefs, clans, and commoners -- Platforms and statues -- Carving, transporting, erecting -- The vanished forest -- Consequences for society -- Europeans and explanations -- Why was Easter fragile? -- Easter as metaphor -- 3. The last people alive : Pitcairn and Henderson Islands -- Pitcairn before the Bounty -- Three dissimilar islands -- Trade -- The movie's ending -- 4. The ancient ones : the Anasazi and their neighbors -- Desert farmers -- Tree rings -- Agricultural strategies -- Chaco's problems and packrats -- Regional integration -- Chaco's decline and end -- Chaco's message -- 5. The Maya collapses -- Mysteries of lost cities -- The Maya environment -- Maya agriculture -- Maya history -- Copán -- Complexities of collapses -- Wars and droughts -- Collapse in the southern lowlands -- The Maya message -- 6. The Viking prelude and fugues -- Experiments in the Atlantic -- The Viking explosion -- Autocatalysis -- Viking agriculture -- Iron -- Viking chiefs -- Viking religion -- Orkneys, Shetlands, Faeroes -- Iceland's environment -- Iceland's history -- Iceland in context -- Vinland -- 7. Norse Greenland's flowering -- Europe's outpost -- Greenland's climate today -- Climate in the past -- Native plants and animals -- Norse settlement -- Farming -- Hunting and fishing -- An integrated economy -- Society -- Trade with Europe -- Self-image -- 8. Norse Greenland's end -- Introduction to the end -- Deforestation -- Soil and turf damage -- The Inuit's predecessors -- Inuit subsistence -- Inuit/Norse relations -- The end -- Ultimate causes of the end -- 9. Opposite paths to success -- Bottom up, top down -- New Guinea highlands -- Tikopia -- Tokugawa problems -- Tokugawa solutions -- Why Japan succeeded -- Other successes --",
            "pt. 3. Modern societies -- 10. Malthus in Africa : Rwanda's genocide -- A dilemma -- Events in Rwanda -- More than ethnic hatred -- Buildup in Kanama -- Explosion in Kanama -- Why it happened -- 11. One island, two peoples, two histories : the Dominican Republic and Haiti -- Differences -- Histories -- Causes of divergence -- Dominican environmental impacts -- Balaguer -- The Dominican environment today -- The future -- 12. China, lurching giant -- China's significance -- Background -- Air, water, soil -- Habitat, species, megaprojects -- Consequences -- Connections -- The future -- 13. \"Mining\" Australia -- Australia's significance -- Soils -- Water -- Distance -- Early history -- Imported values -- Trade and immigration -- Land degradation -- Other environmental problems -- Signs of hope and change --",
            "pt. 4. Practical lessons -- 14. Why do some societies make disastrous decisions? -- Road map for success -- Failure to anticipate -- Failure to perceive -- Rational bad behavior -- Disastrous values -- Other irrational failures -- Unsuccessful solutions -- Signs of hope -- 15. Big businesses and the environment : different conditions, different outcomes -- Resource extraction -- Two oil fields -- Oil company motives -- Hardrock mining operations -- Mining company motives -- Differences among mining companies -- The logging industry -- Forest Stewardship Council -- The seafood industry -- Businesses and the public -- 16. The world as a polder : what does it all mean to us today? -- Introduction -- The most serious problems -- If we don't solve them... -- Life in Los Angeles -- One-liner objections -- The past and the present -- Reasons for hope",
            "What caused some of the great civilizations of the past to collapse into ruin, and what can we learn from their fates? Diamond weaves an all-encompassing global thesis through a series of historical-cultural narratives. Moving from the prehistoric Polynesian culture of Easter Island to the formerly flourishing Native American civilizations of the Anasazi and the Maya, the doomed medieval Viking colony on Greenland, and finally to the modern world, Diamond traces a pattern of catastrophe, spelling out what happens when we squander our resources, when we ignore the signals our environment gives us"
        ],
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
        "loans__status__last_loan_date": "2019-02-24T05:28:16Z",
        "loans__status__last_waitlist_date": "2019-02-07T18:53:32Z",
        "loans__status__num_history": "10",
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
    "server": "ia802905.us.archive.org",
    "simplelists": {
        "holdings": {
            "georgetown-university-law-library-ol": {
                "notes": {
                    "isbn": [
                        "9780143036555"
                    ]
                },
                "sys_changed_by": {
                    "source": "mdapi",
                    "username": "charles.horn@gmail.com"
                },
                "sys_last_changed": "2019-01-28 02:15:21.38933"
            },
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
    "uniq": 1478245624,
    "workable_servers": [
        "ia802905.us.archive.org",
        "ia902905.us.archive.org"
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
  }
}

describe('getMetadata', () => {
  it('should return a dictionary with specified keys when book is found on the Archive', () => {
    let book = response["9780143036555"];
    let result = getMetadata(book);
    expect(result).to.have.keys(['title', 'author', 'image', 'link', 'readable', 'button_class', 'button_text']);
    expect(result['readable']).to.be.true;
  });
});
