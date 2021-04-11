// dnserror.js

// from 'archive.js'
/*   global refreshWayback */

function getParameterByName(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

function main() {
  let page_url = getParameterByName('page_url')
  let wayback_url = getParameterByName('wayback_url')
  document.getElementById('title1').innerHTML = 'Server Not Found'
  document.getElementById('title2').innerHTML = 'Server Not Found'
  document.getElementById('description').innerHTML = "The requested URL's server or domain could not be found. If you entered the URL manually, please check your spelling and try again."
  document.getElementById('page-url').innerHTML = page_url
  document.getElementById('page-url').href = page_url
  refreshWayback(wayback_url, 999)
}

main()
