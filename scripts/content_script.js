function automatic_archive()
 {
     chrome.runtime.sendMessage({message:"checkurl"},function(){});
 }
document.addEventListener('DOMContentLoaded',automatic_archive(), false);