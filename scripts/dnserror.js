function getParameterByName(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

document.getElementById('no-more-404s-dnserror-link').href = getParameterByName('wayback_url');
document.getElementById('status-code-show').innerHTML = getParameterByName('status_code');
document.getElementById('url-show').innerHTML = getParameterByName('page_url');
