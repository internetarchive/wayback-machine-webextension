// booklist_loader.js

// from 'utils.js'
/*   global getUrlByParameter */

// from 'booklist.js'
/*   global populateBooks */

// This runs every time booklist.html is viewed.

window.onload = () => {
  var url = getUrlByParameter('url')
  populateBooks(url)
}
