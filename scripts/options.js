document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
function restore_options() {
  chrome.storage.sync.get({
    notification: true,
    auto_archive: true
  }, function(items) {
    document.getElementById('notify-user').checked= items.notification;
    document.getElementById('auto-archive').checked = items.auto_archive;
  });
}
function save_options() {
  var  notification= document.getElementById('notify-user').checked;
  var auto_archive= document.getElementById('auto-archive').checked;
  chrome.storage.sync.set(
  {
    notification: notification,
    auto_archive: auto_archive
  }, function() {
    console.log(auto_archive);
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
