function save_now_function() {
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    url=tabs[0].url.toString().replace(pattern,"");
    open_url = "https://web.archive.org/save/"+encodeURI(url);
    chrome.runtime.sendMessage({message: "openurl", url: open_url}, function(response) {});
  });
}

function recent_capture_function() {
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    url=tabs[0].url.toString().replace(pattern,"");
    open_url = "https://web.archive.org/web/2/"+encodeURI(url);
     chrome.tabs.update(tabs[0].id, {url:open_url});
  });
}

function first_capture_function() {
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    url=tabs[0].url.toString().replace(pattern,"");
   open_url = "https://web.archive.org/web/0/"+encodeURI(url);
    chrome.tabs.update(tabs[0].id, {url:open_url});
  });
}

function view_all_function() {
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  url = document.location.href.replace(pattern, "");
  open_url = "https://web.archive.org/web/*/"+encodeURI(url);
  document.location.href = open_url;
}
// chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {});
