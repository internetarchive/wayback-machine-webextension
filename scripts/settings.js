document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
function restore_options() {
  chrome.storage.sync.get({
    show_context:'tab',
    auto_archive: false,
    books:false,
    auto_update_context:false,
    alexa:false,
    whois:false,
    tweets:false,
    wbmsummary:false,
    annotations:false,
    annotationsurl:false,
    similarweb:false,
    tagcloud:false,
    showall:false
  }, function(items) {
    document.getElementById('auto-archive').checked = items.auto_archive;
    document.getElementById('books').checked = items.books;
    document.getElementById('show_context').value = items.show_context;
    document.getElementById('auto-update-context').checked=items.auto_update_context;
    document.getElementById('alexa').checked = items.alexa;
    document.getElementById('whois').checked = items.whois;
    document.getElementById('tweets').checked = items.tweets;
    document.getElementById('wbmsummary').checked = items.wbmsummary;
    document.getElementById('annotations').checked = items.annotations;
    document.getElementById('annotationsurl').checked = items.annotationsurl;
    document.getElementById('similarweb').checked = items.similarweb;
    document.getElementById('tagcloud').checked = items.tagcloud;
    document.getElementById('showall').checked = items.showall;
  });
}
function save_options() {
  var show_context = document.getElementById('show_context').value;
  var auto_archive= document.getElementById('auto-archive').checked;
  var books = document.getElementById('books').checked;
  var auto_update_context=document.getElementById('auto-update-context').checked;
  var alexa= document.getElementById('alexa').checked;
  var whois= document.getElementById('whois').checked;
  var tweets= document.getElementById('tweets').checked;
  var wbmsummary= document.getElementById('wbmsummary').checked;
  var annotations= document.getElementById('annotations').checked;
  var annotationsurl=document.getElementById('annotationsurl').checked;
  var similarweb= document.getElementById('similarweb').checked;
  var tagcloud = document.getElementById('tagcloud').checked;
  var showall= document.getElementById('showall').checked;
  chrome.storage.sync.set({
    show_context:show_context,
    auto_archive: auto_archive,
    books:books,
    auto_update_context:auto_update_context,
    alexa:alexa,
    whois:whois,
    tweets:tweets,
    wbmsummary:wbmsummary,
    annotations:annotations,
    annotationsurl:annotationsurl,
    similarweb:similarweb,
    tagcloud:tagcloud,
    showall:showall
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function validate(eventObj) {
  var source=eventObj.target;
  checkboxes = document.getElementsByName('context');
  for(var i=0, n=checkboxes.length;i<n;i++) {
    if(checkboxes[i].checked==true){
      document.getElementById('showall').checked=false;
    }
  }
}
document.getElementById('showall').addEventListener('click',selectall);
function selectall(eventObj){
  var source=eventObj.target;
  checkboxes = document.getElementsByName('context');
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
}

var el = document.getElementsByClassName('only');
for (var i=0;i<el.length; i++) {
    el[i].addEventListener('click',validate);
}