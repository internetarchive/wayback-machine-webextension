  document.addEventListener('DOMContentLoaded', function() {
  var save_now = document.getElementById('save_now');
  save_now.addEventListener('click', function() {
    save_now_function();
  }, false);

  var recent_capture = document.getElementById('recent_capture');
  recent_capture.addEventListener('click', function() {
    recent_capture_function()
  }, false);

  var first_capture = document.getElementById('first_capture');
  first_capture.addEventListener('click', function() {
    first_capture_function()
  }, false);

  var view_all = document.getElementById('view_all');
  view_all.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var view_all=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);
}, false);
