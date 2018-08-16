var manifest=chrome.runtime.getManifest();
var VERSION = manifest.version;
document.getElementById("version").innerHTML="- "+VERSION;