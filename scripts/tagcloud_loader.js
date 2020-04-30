// tagcloud_loader.js

// from 'utils.js'
/*   global getUrlByParameter */

// from 'tagcloud.js'
/*   global get_tags */

window.onload = function () {
  var url = getUrlByParameter('url')
  get_tags(url)
}
