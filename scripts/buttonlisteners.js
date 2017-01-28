document.addEventListener('DOMContentLoaded', function() {
  var save_now = document.getElementById('save_now');
  save_now.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var save_now=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);

  var recent_capture = document.getElementById('recent_capture');
  recent_capture.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var recent_capture=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);

  var first_capture = document.getElementById('first_capture');
  first_capture.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var first_capture=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);

  var view_all = document.getElementById('view_all');
  view_all.addEventListener('click', function() {
    chrome.tabs.executeScript(null, {code: "var view_all=1;"}, function() {
      chrome.tabs.executeScript(null, {file: "scripts/functions.js"}, function() {
      });
    });
  }, false);
}, false);
