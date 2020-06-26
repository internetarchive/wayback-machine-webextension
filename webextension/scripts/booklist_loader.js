// booklist_loader.js

// from 'utils.js'
/*   global getUrlByParameter */

// from 'booklist.js'
/*   global populateBooks */

window.onload = () => {
  var url = getUrlByParameter('url')
  populateBooks(url)
}
