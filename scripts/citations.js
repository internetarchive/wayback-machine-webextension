// Looks for citation: Uri D. Herscher, Jewish Agricultural Utopias in America, 1880-1910 (Detroit: Wayne State University Press, 1991), 123.
// on https://jwa.org/teach/livingthelegacy/jews-and-farming-in-america
// Parse citation to get creator:"Herscher, Uri D" AND title:"Jewish Agricultural Utopias in America"
// search archive to get https://archive.org/details/jewishagricultur0000hers

// $(document).ready(function () {
//   let citation_pattern = /.*, .* \(.*,\s(Inc\.\s)?\d\d\d\d\)(,)?\s?(\d*(,\s)?)*\./g;
//   let body = $('body').innerText;
//   if(body === undefined){
//     body = $('body')[0].innerText;
//   }
//   // console.log(body.match(citation_pattern))
//   // console.log(body.match(citation_pattern).map(getCitation).map(getAdvancedSearchQuery))
//   // TODO: Make a window for this instead of inline citations
//   findCitations()
// })

function findCitations() {
    let candidates = $("a[href^='#_ftnref']").parent()
    for (let i = 0; i < candidates.length; i++) {
        let citation = getCitation(candidates[i].innerText || candidates[i].textContent)
        if (citation) {
            advancedSearch(citation, candidates[i])
        }
    }
}

function getCitation(cit) {
    str = cit.replace(/^[^a-zA-Z]*/, '')
    if (str.length == 0) {
        return null
    } else {
        let publisher = str.match(/\(.*\d\d\d\d\)/)[0]
        let halves = str.split(publisher)
        let pages = halves[1].split(',').filter($.isNumeric).map(Number)
        let commaLoc = halves[0].indexOf(',')
        let title, author
        if (commaLoc >= 0) {
            author = halves[0].slice(0, commaLoc)
            title = halves[0].slice(commaLoc + 1)
        } else {
            author = null
            title = halves[0]
        }
        return {
            title: title.replace(/^\s/, '').replace(/\s$/, ''),
            author: author,
            pages: pages,
            publisher: publisher.slice(1, -1)

        }
    }
}

function getAdvancedSearchQuery(parsed_cit) {
    ({author, title} = parsed_cit)
    // format author
    if (author) {
        author = formatAuthor(author)
        return 'creator:' + author + ' AND title:"' + title + '"'
    } else {
        return 'title:"' + title + '"'
    }
}

function formatAuthor(auth) { //todo: handle multiple authors
    return auth.replace(' and ', ' ')
}

function advancedSearch(citation, cand) {
    query = getAdvancedSearchQuery(citation)
    chrome.runtime.sendMessage({
        message: 'citationadvancedsearch',
        query: query
    }, function (identifier) {
        if (identifier) {
            insertLink(getUrlFromIdentifier(identifier, citation), cand)
        }
        // $(cand).html(
        //   cand.innerHTML.replace('<em>', '<a href="https://archive.org/details/' + identifier + pagestring + '"><em>').replace('</em>', '</em></a>')
        // )
    })
}

function getUrlFromIdentifier(identifier, citation) {
    let pagestring = ''
    if (citation.pages) {
        pagestring = '/page/' + citation.pages[0]
    }
    let url = 'https://archive.org/details/' + identifier + pagestring
    return url
}

function insertLink(url, cand) {
    $(cand).html(
        cand.innerHTML.replace('<em>', '<a target="_blank" href="' + url + '"><em>').replace('</em>', '</em></a>')
    )
}

// let host = 'https://archive.org/advancedsearch.php?q='
// let endsearch = '&fl%5B%5D=identifier&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=50&page=1&output=json&save=yes'
// let url = host + query + endsearch
// $.ajax({
//   url: url,
//   type: 'GET',
//   dataType: 'json',
//   crossDomain: true,
//   jsonp: 'callback'
// })
// .done(function (data) {
//   if (data.response.docs.length > 0) {
//     let identifier = data.response.docs[0].identifier
//     let pagestring = ''
//     if (citation.pages) {
//       pagestring = '/page/' + citation.pages[0]
//     }
//     $(cand).html(
//       cand.innerHTML.replace('<em>', '<a href="https://archive.org/details/' + identifier + pagestring + '"><em>').replace('</em>', '</em></a>')
//     )
//   }
// })
// .fail(function (err) {
//   console.log(err)
// })

if (typeof module !== 'undefined') {
    module.exports = {
        getCitation: getCitation,
        getAdvancedSearchQuery: getAdvancedSearchQuery
    }
}
