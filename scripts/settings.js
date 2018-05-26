document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
function restore_options() {
  chrome.storage.sync.get(['auto_archive'], function(items) {
    document.getElementById('auto-archive').checked = items.auto_archive;
  });
}
function save_options() {
  var auto_archive= document.getElementById('auto-archive').checked;
  chrome.storage.sync.set({
    auto_archive: auto_archive
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}
