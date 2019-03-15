// Looks for citation: Uri D. Herscher, Jewish Agricultural Utopias in America, 1880-1910 (Detroit: Wayne State University Press, 1991), 123.
// on https://jwa.org/teach/livingthelegacy/jews-and-farming-in-america
// Parse citation to get creator:"Herscher, Uri D" AND title:"Jewish Agricultural Utopias in America"
// search archive to get https://archive.org/details/jewishagricultur0000hers


$(document).ready(function() {
  findCitations()
});

function findCitations(){
  let candidates = $("a[href^='#_ftnref']").parent()
  for(let i = 0; i < candidates.length; i++){
    let citation = getCitation(candidates[i].innerHTML)
    if(citation){
      advancedSearch(citation, candidates[i])
    }
  }
}

function getCitation(cit){
  str = cit.replace(/<a href="#_ftnref\d" name="_ftn\d" title="" id="_ftn\d">\[\d\]<\/a>/, '')
  if(str.length == 0){
    return null
  }else{
    [author, ...rest] = str.split("<em>");
    [title, ...rest] = rest[0].split("</em>")
    //TODO: get publisher
    let pages = rest[0].slice(rest[0].indexOf(')')+1).split(',')
    return {
      title:title,
      author:author.replace(/,\s?$/, ''),
      pages: pages.filter($.isNumeric).map(Number)
    }
  }
}

function getAdvancedSearchQuery(parsed_cit){
({author, title} = parsed_cit)
  //format author
  author = formatAuthor(author)
  return 'creator:"'+author+'" AND title:"'+title+'"'
}

function formatAuthor(auth){
  let names = auth.split(".")
  return names[1] + " " + names[0]
}

function advancedSearch(citation, cand){
  query = getAdvancedSearchQuery(citation)
  let host = 'https://archive.org/advancedsearch.php?q='
  let endsearch = '&fl%5B%5D=identifier&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=50&page=1&output=json&save=yes'
  let url = host+query+endsearch
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    crossDomain: true,
    jsonp: 'callback'
  })
  .done(function(data) {
    if(data.response.docs.length>0){
      let identifier = data.response.docs[0].identifier
      let pagestring = ''
      if (citation.pages){
        pagestring = '/page/' + citation.pages[0]
      }
      $(cand).html(
        cand.innerHTML.replace('<em>', '<a href="https://archive.org/details/'+identifier +pagestring+'"><em>').replace('</em>', '</em></a>')
      )
    }
  })
  .fail(function(err) {
    console.log(err);
  })
}
if (typeof module !== 'undefined') {
  module.exports = {
    getCitation:getCitation
  }
}
