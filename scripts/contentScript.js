function automatic_archive() {
  chrome.runtime.sendMessage(
    {
      message: "checkurl",
      page_url: window.location.href
    },
    function() {}
  );
}
window.onload = automatic_archive;
