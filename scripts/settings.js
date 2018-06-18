document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
function restore_options() {
  chrome.storage.sync.get({
    show_context:'tab',
    auto_archive: false,
    show_links: 'wayback'
    
  }, function(items) {
    document.getElementById('auto-archive').checked = items.auto_archive;
    document.getElementById('show_context').value = items.show_context;
    document.getElementById('show_links').value = items.show_links;
  });
}
function save_options() {
  var show_context = document.getElementById('show_context').value;
  var auto_archive= document.getElementById('auto-archive').checked;
  var show_links= document.getElementById('show_links').value;
  chrome.storage.sync.set({
    show_context:show_context,
    auto_archive: auto_archive,
    show_links:show_links
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}
