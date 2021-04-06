// dnserror.js

function getParameterByName(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

document.getElementById('archiveBtn').href = getParameterByName('wayback_url')
document.getElementById('txt').innerHTML = 'Status Code: ' + getParameterByName('status_code')
