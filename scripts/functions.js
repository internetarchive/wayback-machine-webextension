function save_now_function() {
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  url = document.location.href.replace(pattern, "");
  open_url = "https://web.archive.org/save/"+encodeURI(url);
  chrome.runtime.sendMessage({message: "openurl", url: open_url}, function(response) {});
}

function recent_capture_function() {
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  url = document.location.href.replace(pattern, "");
  open_url = "https://web.archive.org/web/2/"+encodeURI(url);
  document.location.href = open_url;
}

function first_capture_function() {
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  url = document.location.href.replace(pattern, "");
  open_url = "https://web.archive.org/web/0/"+encodeURI(url);
  document.location.href = open_url;
}

function view_all_function() {
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  url = document.location.href.replace(pattern, "");
  open_url = "https://web.archive.org/web/*/"+encodeURI(url);
  document.location.href = open_url;
}

try {
  if (save_now !== undefined && save_now==1) {
    save_now_function();
  }
} catch (err) {}

try {
  if (recent_capture !== undefined && recent_capture==1) {
    recent_capture_function();
  }
} catch (err) {}

try {
  if (first_capture !== undefined && first_capture==1) {
    first_capture_function();
  }
} catch (err) {}

try {
  if (view_all !== undefined && view_all == 1) {
    view_all_function();
  }
} catch (err) {}

// chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {});
